import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function contentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.map':
      return 'application/json; charset=utf-8';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

function safeJoin(root: string, reqPath: string): string | null {
  const p = reqPath.replace(/^\//, '');
  const joined = path.join(root, p);
  const normalized = path.normalize(joined);
  const rel = path.relative(root, normalized);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return normalized;
}

export async function startStaticServer({
  rootDir = 'dist',
  port = 0,
  host = '127.0.0.1'
}: {
  rootDir?: string;
  port?: number;
  host?: string;
}) {
  const root = path.resolve(process.cwd(), rootDir);
  const indexPath = path.join(root, 'index.html');

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
      const pathname = decodeURIComponent(url.pathname);

      const requested = pathname === '/' ? indexPath : safeJoin(root, pathname);
      if (!requested) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      const candidate = requested;
      const exists = await stat(candidate).then(
        (s) => (s.isFile() ? true : false),
        () => false
      );

      const toServe = exists ? candidate : indexPath;
      const body = await readFile(toServe);
      res.statusCode = 200;
      res.setHeader('content-type', contentType(toServe));
      res.end(body);
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  });

  await new Promise<void>((resolve) => server.listen(port, host, resolve));
  const addr = server.address();
  if (!addr || typeof addr === 'string') throw new Error('Failed to start server');
  const url = `http://${host}:${addr.port}`;

  return {
    url,
    port: addr.port,
    close: () => new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())))
  };
}

function parseNumberFlag(name: string, defaultValue: number): number {
  const idx = process.argv.findIndex((a) => a === name || a.startsWith(`${name}=`));
  if (idx === -1) return defaultValue;
  const arg = process.argv[idx]!;
  const value = arg.includes('=') ? arg.split('=')[1] : process.argv[idx + 1];
  if (!value) return defaultValue;
  const n = Number(value);
  return Number.isFinite(n) ? n : defaultValue;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = parseNumberFlag('--port', 4173);
  startStaticServer({ port })
    .then(({ url }) => {
      // eslint-disable-next-line no-console
      console.log(`Serving dist/ at ${url}`);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exitCode = 1;
    });
}
