#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function usage() {
  const text = `
create-imagine

Usage:
  create-imagine [targetDir] [options]

Options:
  --template blank|example
  --pm npm|pnpm|yarn|bun
  --install / --no-install
  --skills / --no-skills
  --yes
  --force
  --help
`.trim();
  // eslint-disable-next-line no-console
  console.log(text);
}

function parseArgs(argv) {
  /** @type {{ targetDir?: string; template?: string; pm?: string; install?: boolean; skills?: boolean; yes: boolean; force: boolean; help: boolean }} */
  const out = { yes: false, force: false, help: false };
  /** @type {string[]} */
  const positional = [];
  /** @type {string[]} */
  const unknown = [];

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a) continue;

    if (a === '--') {
      positional.push(...argv.slice(i + 1).filter(Boolean));
      break;
    }

    if (a === '--help' || a === '-h') {
      out.help = true;
      continue;
    }
    if (a === '--yes' || a === '-y') {
      out.yes = true;
      continue;
    }
    if (a === '--force') {
      out.force = true;
      continue;
    }
    if (a === '--install') {
      out.install = true;
      continue;
    }
    if (a === '--no-install') {
      out.install = false;
      continue;
    }
    if (a === '--skills') {
      out.skills = true;
      continue;
    }
    if (a === '--no-skills') {
      out.skills = false;
      continue;
    }

    if (a === '--template') {
      const v = argv[i + 1];
      if (!v) unknown.push(a);
      else out.template = v;
      i += 1;
      continue;
    }
    if (a.startsWith('--template=')) {
      out.template = a.slice('--template='.length);
      continue;
    }

    if (a === '--pm') {
      const v = argv[i + 1];
      if (!v) unknown.push(a);
      else out.pm = v;
      i += 1;
      continue;
    }
    if (a.startsWith('--pm=')) {
      out.pm = a.slice('--pm='.length);
      continue;
    }

    if (a.startsWith('-')) {
      unknown.push(a);
      continue;
    }

    positional.push(a);
  }

  if (unknown.length) {
    const msg = `Unknown option(s): ${unknown.join(', ')}`;
    const err = new Error(msg);
    // @ts-ignore
    err.code = 'USAGE';
    throw err;
  }

  if (positional.length > 1) {
    const err = new Error(`Too many arguments. Expected at most 1 targetDir, got: ${positional.join(' ')}`);
    // @ts-ignore
    err.code = 'USAGE';
    throw err;
  }

  if (positional.length === 1) out.targetDir = positional[0];
  return out;
}

function isNonEmptyDir(entries) {
  return entries.some((e) => e !== '.' && e !== '..');
}

async function dirExists(p) {
  return fs
    .stat(p)
    .then((s) => s.isDirectory())
    .catch(() => false);
}

async function fileExists(p) {
  return fs
    .stat(p)
    .then((s) => s.isFile())
    .catch(() => false);
}

async function isDirEmpty(p) {
  const entries = await fs.readdir(p).catch(() => null);
  if (!entries) return true;
  return !isNonEmptyDir(entries);
}

function toKebabCase(input) {
  return String(input)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toValidPackageName(baseName) {
  let name = toKebabCase(baseName);
  name = name.replace(/^[_\\.]+/, '');
  name = name.replace(/[^a-z0-9-]+/g, '');
  name = name.replace(/^-+|-+$/g, '');
  if (!name) name = 'imagine-project';
  return name;
}

function toTitle(input) {
  const words = String(input)
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean);
  if (!words.length) return 'Imagine Project';
  return words.map((w) => w.slice(0, 1).toUpperCase() + w.slice(1)).join(' ');
}

function detectPackageManager() {
  const ua = process.env.npm_config_user_agent ?? '';
  const m = ua.match(/^(npm|pnpm|yarn|bun)\//);
  return m?.[1] ?? null;
}

function platformBin(cmd) {
  if (process.platform !== 'win32') return cmd;
  return `${cmd}.cmd`;
}

function run(cmd, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts?.cwd ?? process.cwd(),
      stdio: 'inherit',
      env: process.env
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

async function copyDirContents(srcDir, destDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(srcDir, e.name);
    const dest = path.join(destDir, e.name);
    await fs.cp(src, dest, { recursive: true });
  }
}

function ensureTemplate(value) {
  if (value !== 'blank' && value !== 'example') {
    const err = new Error(`Invalid --template: ${value}. Expected "blank" or "example".`);
    // @ts-ignore
    err.code = 'USAGE';
    throw err;
  }
  return value;
}

function ensurePm(value) {
  if (value !== 'npm' && value !== 'pnpm' && value !== 'yarn' && value !== 'bun') {
    const err = new Error(`Invalid --pm: ${value}. Expected npm|pnpm|yarn|bun.`);
    // @ts-ignore
    err.code = 'USAGE';
    throw err;
  }
  return value;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    usage();
    return;
  }

  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  const rl = interactive ? createInterface({ input: process.stdin, output: process.stdout }) : null;

  try {
    const imagineSkillsRepo = 'https://github.com/midhunxavier/imagine-skills';
    const imagineSkillsName = 'imagine-best-practices';
    const imagineSkillsInstallCmd = `npx skills add ${imagineSkillsRepo} --skill ${imagineSkillsName} --agent codex`;

    const cwdBase = path.basename(process.cwd());
    const defaultTargetDir = cwdBase && cwdBase !== path.parse(process.cwd()).root ? cwdBase : 'imagine-project';

    let targetDirInput = args.targetDir;
    if (!targetDirInput) {
      if (args.yes || !interactive) {
        targetDirInput = defaultTargetDir;
      } else {
        const answer = await rl.question(`Project directory (${defaultTargetDir}): `);
        targetDirInput = answer.trim() || defaultTargetDir;
      }
    }

    const targetPath = path.resolve(process.cwd(), targetDirInput);
    const targetBaseName = path.basename(targetPath);

    const template = ensureTemplate(
      args.template ??
        (args.yes || !interactive
          ? 'blank'
          : ensureTemplate((await rl.question('Template (blank/example) (blank): ')).trim() || 'blank'))
    );

    const install =
      args.install ??
      (args.yes || !interactive
        ? true
        : (() => {
            return null;
          })());

    let shouldInstall = install;
    if (shouldInstall === null) {
      const answer = (await rl.question('Install dependencies? (Y/n): ')).trim().toLowerCase();
      shouldInstall = answer === '' || answer === 'y' || answer === 'yes';
    }

    let pm = args.pm ?? null;
    if (shouldInstall) {
      if (!pm) pm = args.yes || !interactive ? detectPackageManager() ?? 'npm' : null;
      if (!pm && interactive) {
        const answer = (await rl.question('Package manager (npm/pnpm/yarn/bun) (npm): ')).trim().toLowerCase();
        pm = answer || 'npm';
      }
      pm = ensurePm(pm ?? 'npm');
    }

    const skills =
      args.skills ??
      (args.yes || !interactive
        ? false
        : (() => {
            return null;
          })());

    let shouldInstallSkills = skills;
    if (shouldInstallSkills === null) {
      const answer = (await rl.question(
        `Install Imagine agent skill "${imagineSkillsName}" in this project? (creates .agents/skills) (y/N): `
      ))
        .trim()
        .toLowerCase();
      shouldInstallSkills = answer === 'y' || answer === 'yes';
    }

    const existsDir = await dirExists(targetPath);
    if (existsDir) {
      const empty = await isDirEmpty(targetPath);
      if (!empty) {
        if (!args.force) {
          throw new Error(`Target directory is not empty: ${targetPath}\nUse --force to overwrite.`);
        }
        await fs.rm(targetPath, { recursive: true, force: true });
      }
    } else {
      const existsFile = await fileExists(targetPath);
      if (existsFile) throw new Error(`Target path exists and is a file: ${targetPath}`);
    }

    await fs.mkdir(targetPath, { recursive: true });

    const templateDir = path.resolve(__dirname, '..', 'templates', template);
    await copyDirContents(templateDir, targetPath);

    const gitignoreSrc = path.join(targetPath, 'gitignore');
    const gitignoreDest = path.join(targetPath, '.gitignore');
    if (await fileExists(gitignoreSrc)) {
      await fs.rename(gitignoreSrc, gitignoreDest).catch(async (err) => {
        if (String(err?.code ?? '') === 'EEXIST') {
          await fs.rm(gitignoreDest, { force: true });
          await fs.rename(gitignoreSrc, gitignoreDest);
          return;
        }
        throw err;
      });
    }

    const pkgPath = path.join(targetPath, 'package.json');
    const pkgRaw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    pkg.name = toValidPackageName(targetBaseName);
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

    const readmePath = path.join(targetPath, 'README.md');
    if (await fileExists(readmePath)) {
      const raw = await fs.readFile(readmePath, 'utf8');
      const lines = raw.split(/\\r?\\n/);
      lines[0] = `# ${toTitle(targetBaseName)}`;
      await fs.writeFile(readmePath, lines.join('\n'), 'utf8');
    }

    if (shouldInstall) {
      const bin = platformBin(pm);
      await run(bin, ['install'], { cwd: targetPath });
    }

    if (shouldInstallSkills) {
      const npx = platformBin('npx');
      try {
        await run(
          npx,
          ['--yes', 'skills', 'add', imagineSkillsRepo, '--skill', imagineSkillsName, '--agent', 'codex', '-y'],
          { cwd: targetPath }
        );

        // Some skills tooling creates both `.agents/skills/<skill>` and `skills/<skill>` for compatibility.
        // Avoid leaving the redundant `skills/` directory if it's just a shim pointing at `.agents/skills`.
        const skillsDir = path.join(targetPath, 'skills');
        const maybeSkillLink = path.join(skillsDir, imagineSkillsName);
        const shimExists = await dirExists(skillsDir);
        if (shimExists) {
          const entries = await fs.readdir(skillsDir).catch(() => []);
          const onlyThisSkill = entries.length === 1 && entries[0] === imagineSkillsName;
          if (onlyThisSkill) {
            const link = await fs.readlink(maybeSkillLink).catch(() => null);
            if (link && link.includes('.agents')) {
              await fs.rm(skillsDir, { recursive: true, force: true });
            }
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('\nFailed to install skills (optional). You can run this later:\n');
        // eslint-disable-next-line no-console
        console.error(`  ${imagineSkillsInstallCmd}\n`);
      }
    }

    const cdPath = path.isAbsolute(targetDirInput) ? targetPath : targetDirInput;

    // eslint-disable-next-line no-console
    console.log('\nDone.\n');
    // eslint-disable-next-line no-console
    console.log('Next steps:');
    // eslint-disable-next-line no-console
    console.log(`  cd ${cdPath}`);
    if (!shouldInstall) {
      // eslint-disable-next-line no-console
      console.log('  npm install');
    }
    // eslint-disable-next-line no-console
    console.log('  npm run dev');
    // eslint-disable-next-line no-console
    console.log('  npm run render -- --project example');
    // eslint-disable-next-line no-console
    console.log(`\nOptional: ${imagineSkillsInstallCmd}`);
  } finally {
    if (rl) rl.close();
  }
}

main().catch((err) => {
  if (String(err?.code ?? '') === 'USAGE') usage();
  // eslint-disable-next-line no-console
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
