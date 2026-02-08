import path from 'node:path';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import type { FigureManifestItem, FigureVariant } from '../src/core/manifest';
import { resolveSize } from '../src/framework/sizing';
import { startStaticServer } from './server';
import { emptyPropsFile, validatePropsFileV1 } from '../src/core/manifest';
import { loadProjectDefinition } from './projects';

type Mode = 'build' | 'dev';

function platformNpmBin() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function run(cmd: string, args: string[], opts: { cwd?: string } = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd ?? process.cwd(),
      stdio: 'inherit',
      env: process.env
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

function splitList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function collectFlagValues(name: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < process.argv.length; i++) {
    const a = process.argv[i]!;
    if (a === name) {
      const v = process.argv[i + 1];
      out.push(...splitList(v));
      i += 1;
      continue;
    }
    if (a.startsWith(`${name}=`)) {
      out.push(...splitList(a.slice(name.length + 1)));
    }
  }
  return out;
}

function getFlag(name: string): string | undefined {
  const idx = process.argv.findIndex((a) => a === name || a.startsWith(`${name}=`));
  if (idx === -1) return undefined;
  const a = process.argv[idx]!;
  if (a.startsWith(`${name}=`)) return a.slice(name.length + 1);
  return process.argv[idx + 1];
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function safeFilePart(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]+/g, '-');
}

function usage() {
  const text = `
Imagine renderer

Usage:
  npm run render -- [options]

Options:
  --project <id>       Project id. Defaults to "example".
  --fig <id>           Limit to figure id(s). Repeatable or comma-separated.
  --variant <id>       Limit to variant id(s). Repeatable or comma-separated.
  --formats png,svg    Defaults to "png,svg".
  --out <dir>          Defaults to "out/<projectId>".
  --mode build|dev     Defaults to "build".
  --url <url>          Dev server URL (dev mode). Defaults to http://localhost:5173
  --props-file <path>  Defaults to "projects/<projectId>/props.json" (if exists).
  --no-props           Ignore props overrides file.
  --no-manifest        Do not write out/manifest.json.
  --help
`.trim();
  // eslint-disable-next-line no-console
  console.log(text);
}

type RenderTarget = {
  figure: FigureManifestItem;
  variant: FigureVariant;
};

function selectTargets({
  figures,
  figureIds,
  variantIds
}: {
  figures: FigureManifestItem[];
  figureIds: string[];
  variantIds: string[];
}): RenderTarget[] {
  const figSet = new Set(figureIds);
  const varSet = new Set(variantIds);

  const selectedFigures = figureIds.length ? figures.filter((f) => figSet.has(f.id)) : figures;
  const out: RenderTarget[] = [];

  for (const f of selectedFigures) {
    const variants = variantIds.length ? f.variants.filter((v) => varSet.has(v.id)) : f.variants;
    for (const v of variants) out.push({ figure: f, variant: v });
  }
  return out;
}

async function main() {
  if (hasFlag('--help') || hasFlag('-h')) {
    usage();
    return;
  }

  const projectId = getFlag('--project') ?? 'example';
  const figureIds = collectFlagValues('--fig');
  const variantIds = collectFlagValues('--variant');
  const formats = new Set(splitList(getFlag('--formats') ?? 'png,svg').map((s) => s.toLowerCase()));
  const outDir = path.resolve(process.cwd(), getFlag('--out') ?? path.join('out', projectId));
  const mode = ((getFlag('--mode') ?? 'build') as Mode) satisfies Mode;
  const url = getFlag('--url') ?? 'http://localhost:5173';
  const noProps = hasFlag('--no-props');
  const noManifest = hasFlag('--no-manifest');
  const propsFilePath = getFlag('--props-file') ?? path.join('projects', projectId, 'props.json');

  if (mode !== 'build' && mode !== 'dev') {
    throw new Error(`Invalid --mode: ${mode}`);
  }

  if (![...formats].every((f) => f === 'png' || f === 'svg')) {
    throw new Error(`Invalid --formats: ${[...formats].join(',')}`);
  }

  const project = await loadProjectDefinition(projectId);
  const targets = selectTargets({ figures: project.figures, figureIds, variantIds });
  if (!targets.length) {
    throw new Error(`No render targets matched. --fig=${figureIds.join(',')} --variant=${variantIds.join(',')}`);
  }

  await fs.mkdir(outDir, { recursive: true });

  const propsFile = noProps
    ? emptyPropsFile()
    : await fs
        .readFile(propsFilePath, 'utf8')
        .then((raw) => validatePropsFileV1(JSON.parse(raw)))
        .catch(() => emptyPropsFile());

  let baseUrl = url;
  let closeServer: (() => Promise<void>) | null = null;

  if (mode === 'build') {
    await run(platformNpmBin(), ['run', 'build']);
    const srv = await startStaticServer({ rootDir: 'dist', port: 0 });
    baseUrl = srv.url;
    closeServer = srv.close;
  }

  const browser = await chromium.launch();
  const results: Array<{
    figureId: string;
    variantId: string;
    size: { width: number; height: number };
    mm?: { width: number; height: number; dpi: number };
    outputs: { png?: string; svg?: string };
  }> = [];

  try {
    for (const t of targets) {
      const effectiveSize = t.variant.size ?? t.figure.size;
      const resolved = resolveSize(effectiveSize);
      const bg = t.variant.background ?? 'white';
      const overrides = (propsFile.overrides[t.figure.id]?.[t.variant.id] ?? {}) as Record<string, unknown>;
      const propsParam =
        overrides && typeof overrides === 'object' && Object.keys(overrides).length
          ? `?props=${encodeURIComponent(base64UrlEncode(JSON.stringify(overrides)))}`
          : '';
      const route = `/#/render/${encodeURIComponent(projectId)}/${encodeURIComponent(t.figure.id)}/${encodeURIComponent(t.variant.id)}${propsParam}`;
      const pageUrl = `${baseUrl}${route}`;

      // eslint-disable-next-line no-console
      console.log(`Rendering ${t.figure.id}/${t.variant.id} (${resolved.width}×${resolved.height}px) …`);

      const context = await browser.newContext({
        viewport: { width: resolved.width, height: resolved.height },
        deviceScaleFactor: 1
      });
      const page = await context.newPage();
      page.on('pageerror', (err) => {
        // eslint-disable-next-line no-console
        console.error(`[pageerror] ${t.figure.id}/${t.variant.id}:`, err);
      });
      page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        // eslint-disable-next-line no-console
        console.error(`[console.${msg.type()}] ${t.figure.id}/${t.variant.id}: ${msg.text()}`);
      });
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => (window as any).__IMAGINE_READY__ === true, null, { timeout: 30_000 });
      await page.locator('#figure-root').waitFor({ state: 'attached', timeout: 30_000 });

      const outputs: { png?: string; svg?: string } = {};
      const baseName = `${safeFilePart(t.figure.id)}--${safeFilePart(t.variant.id)}`;

      if (formats.has('png')) {
        const outPath = path.join(outDir, `${baseName}.png`);
        const locator = page.locator('#figure-root');
        await locator.screenshot({
          path: outPath,
          omitBackground: bg === 'transparent',
          animations: 'disabled'
        });
        outputs.png = path.relative(outDir, outPath);
      }

      if (formats.has('svg')) {
        const outPath = path.join(outDir, `${baseName}.svg`);
        const svg = await page.$eval('#figure-root svg', (el) => (el as SVGElement).outerHTML);
        await fs.writeFile(outPath, `${svg}\n`, 'utf8');
        outputs.svg = path.relative(outDir, outPath);
      }

      results.push({
        figureId: t.figure.id,
        variantId: t.variant.id,
        size: { width: resolved.width, height: resolved.height },
        mm: resolved.mm && resolved.dpi ? { width: resolved.mm.width, height: resolved.mm.height, dpi: resolved.dpi } : undefined,
        outputs
      });

      await context.close();
    }
  } finally {
    await browser.close();
    if (closeServer) await closeServer();
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  if (!noManifest) {
    await fs.writeFile(
      manifestPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          projectId,
          mode,
          baseUrl,
          results
        },
        null,
        2
      ) + '\n',
      'utf8'
    );

    // eslint-disable-next-line no-console
    console.log(`Wrote ${manifestPath}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
