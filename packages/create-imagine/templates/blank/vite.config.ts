import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { emptyPropsFile, PROJECT_ID_RE, validatePropsFileV1 } from './src/core/manifest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function imaginePropsApi(): Plugin {
  return {
    name: 'imagine-props-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void (async () => {
          const url = new URL(req.url ?? '/', 'http://localhost');
          if (url.pathname !== '/__imagine/props') return next();

          const projectId = url.searchParams.get('projectId') ?? '';
          if (!PROJECT_ID_RE.test(projectId)) {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'Invalid projectId' }));
            return;
          }

          const filePath = path.resolve(__dirname, 'projects', projectId, 'props.json');

          if (req.method === 'GET') {
            const body = await fs
              .readFile(filePath, 'utf8')
              .then((raw) => validatePropsFileV1(JSON.parse(raw)))
              .catch(() => emptyPropsFile());

            res.statusCode = 200;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(body));
            return;
          }

          if (req.method === 'POST') {
            const chunks: Buffer[] = [];
            await new Promise<void>((resolve, reject) => {
              req.on('data', (c) => chunks.push(c as Buffer));
              req.on('end', () => resolve());
              req.on('error', reject);
            });

            const raw = Buffer.concat(chunks).toString('utf8');
            const json = JSON.parse(raw);
            const validated = validatePropsFileV1(json);

            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(validated, null, 2) + '\n', 'utf8');

            res.statusCode = 204;
            res.end();
            return;
          }

          res.statusCode = 405;
          res.end('Method not allowed');
        })().catch(next);
      });
    }
  };
}

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [react(), imaginePropsApi()]
});
