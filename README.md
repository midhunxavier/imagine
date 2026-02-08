# Imagine

React → scientific figures (PNG + SVG) with a live Studio and a Playwright renderer.

## Quickstart

```bash
npm install
npm run dev
```

Open the Studio at http://localhost:5173

## List figures

```bash
npm run list
```

## Render exports

```bash
npm run render
```

Outputs are written to `out/`:
- `out/<figure>--<variant>.png`
- `out/<figure>--<variant>.svg`
- `out/manifest.json`

### Render options

```bash
# Only one figure
npm run render -- --fig line-chart

# Only one variant
npm run render -- --fig hello-world --variant transparent

# Dev-mode rendering (requires `npm run dev` already running)
npm run render:dev
```

Common flags:
- `--fig <id>` (repeatable or comma-separated)
- `--variant <id>` (repeatable or comma-separated)
- `--formats png,svg`
- `--out <dir>`
- `--mode build|dev`
- `--url http://localhost:5173` (dev mode)

## Create a new figure

1. Add a new file in `src/figures/` that default-exports a React component whose root is an `<svg>`.
2. Register it in `src/figures/manifest.ts` with an `id`, `title`, `moduleKey`, and at least one variant.
3. Run `npm run dev` and select it in the Studio.

Notes:
- `moduleKey` must match the figure filename (without `.tsx`). Example: `src/figures/my-figure.tsx` → `moduleKey: "my-figure"`.
- Sizes can be specified as pixels or paper-friendly `mm + dpi` (converted to px for rendering).
- MathJax is loaded on-demand from CDN by default. Override with `VITE_MATHJAX_URL` if needed.
