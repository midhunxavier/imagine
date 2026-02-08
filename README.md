# Imagine

React → scientific figures (PNG + SVG) with a live Studio and a Playwright renderer.

**🎉 NEW: v2 Enhanced API** with smart auto-inference, 8 publication themes, and 70% less boilerplate!

## 📚 Documentation

- **[Implementation Guide](./IMPLEMENTATION.md)** - v2 API usage and examples
- **[Master Plan](./docs/MASTER_PLAN.md)** - Complete 48-week enhancement roadmap  
- **[Progress Tracker](./docs/PROGRESS.md)** - Current development status
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Developer quick guide
- **[Analysis](./ANALYSIS.md)** - Gap analysis and competitive landscape

## ✨ v2 Highlights

### Smart Auto-Inference
```tsx
import { LineChart } from '@/charts-v2';

// Auto-infers x/y fields, scales, margins - just works!
<LineChart data={data} width={800} height={600} />

// Or customize
<LineChart data={data} x="time" y="value" theme="nature" showGrid />
```

### 8 Publication Themes
`nature` • `science` • `cell` • `colorblind` • `default` • `minimal` • `print` • `dark`

### 70% Less Boilerplate
**Before (v1):** 15+ lines of setup → **After (v2):** 1 line!

---

## Quickstart

```bash
npm install
npm run dev
```

Open the Studio at http://localhost:5173

## Projects

Figures are organized into projects under `projects/<id>/`.

The Studio home shows projects. Clicking a project shows:
- a preview gallery (static images from `public/`)
- the live React-generated figures for that project

```bash
npm run list
```

List one project’s figures:

```bash
npm run list -- --project example
```

## Render exports

```bash
npm run render -- --project example
```

By default outputs are written to `out/<projectId>/`:
- `out/<projectId>/<figure>--<variant>.png`
- `out/<projectId>/<figure>--<variant>.svg`
- `out/<projectId>/manifest.json`

### Render options

```bash
# Only one figure
npm run render -- --project example --fig line-chart

# Only one variant
npm run render -- --project example --fig hello-world --variant transparent

# Dev-mode rendering (requires `npm run dev` already running)
npm run render:dev -- --project example
```

Common flags:
- `--project <id>`
- `--fig <id>` (repeatable or comma-separated)
- `--variant <id>` (repeatable or comma-separated)
- `--formats png,svg`
- `--out <dir>`
- `--mode build|dev`
- `--url http://localhost:5173` (dev mode)
- `--no-props` (ignore Studio-saved overrides)

## Text editing (Studio Controls)

When you edit figure text in Studio, it saves overrides into:
- `projects/<projectId>/props.json`

`npm run render` automatically uses those overrides (unless `--no-props`).

## Create a new project

To scaffold a fresh project folder:

```bash
npx create-imagine@latest my-figures
```

Optional: install the Imagine best-practices agent skill:

```bash
npx skills add https://github.com/midhunxavier/imagine-skills --skill imagine-best-practices --agent codex
```

Or inside this repo:

1. Copy `projects/example/` to `projects/<your-id>/`
2. Update `projects/<your-id>/project.ts` and `projects/<your-id>/manifest.ts`
3. Restart `npm run dev` (project discovery is build-time)

## Create a new figure (inside a project)

1. Add a new file in `projects/<projectId>/figures/` that default-exports a React component whose root is an `<svg>`.
2. Register it in `projects/<projectId>/manifest.ts` with an `id`, `title`, `moduleKey`, and at least one variant.
3. Optionally add preview images under `public/projects/<projectId>/previews/` and reference them from `projects/<projectId>/project.ts`.

Notes:
- `moduleKey` must match the figure filename (without `.tsx`). Example: `projects/example/figures/line-chart.tsx` → `moduleKey: "line-chart"`.
- Sizes can be specified as pixels or paper-friendly `mm + dpi` (converted to px for rendering).
- MathJax is loaded on-demand from CDN by default. Override with `VITE_MATHJAX_URL` if needed.

## Generate example previews

```bash
npm run render:previews
```

This writes PNGs to `public/projects/example/previews/`.
