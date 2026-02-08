# Imagine v2: Quick Reference

**For Developers Working on the Enhancement Plan**

---

## 🚀 Quick Start

```bash
# Clone & install
cd /Users/mx/Documents/Work/MX/melwin-repos/imagine
npm install

# Development
npm run dev          # Start Studio on :5173
npm run build        # Build for production
npm run render       # Export figures to PNG/SVG

# Testing
npm run test         # Run tests (when added)
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `docs/MASTER_PLAN.md` | Complete 48-week implementation plan |
| `docs/PROGRESS.md` | Current progress tracking |
| `IMPLEMENTATION.md` | v2 usage guide and examples |
| `ANALYSIS.md` | Comprehensive analysis and roadmap |
| `SUMMARY.md` | Implementation summary |

---

## 🏗️ Architecture

### New v2 Structure

```
src/
├── core/                   # Foundation
│   ├── data-types.ts      # Field inference
│   ├── scales-v2.ts       # Smart scales
│   ├── layout.ts          # Adaptive margins
│   └── theme-v2.ts        # 8 theme presets
│
└── charts-v2/             # Modern API
    ├── Chart.tsx          # Smart container
    ├── SimpleCharts.tsx   # LineChart, BarChart, etc.
    ├── series/            # LineSeries, BarSeries, etc.
    ├── axes/              # Enhanced axes
    └── decorations/       # Title, Legend (future)
```

### V1 (Preserved)

```
src/framework/             # Original components
    ├── Figure.tsx
    ├── charts/
    ├── diagrams/
    └── math/
```

---

## 🎨 Current Components (v2)

### All-in-One Charts
```tsx
import { LineChart, ScatterPlot, BarChart } from '@/charts-v2';
```

### Compositional
```tsx
import { Chart } from '@/charts-v2';
import { LineSeries, ScatterSeries, BarSeries, AreaSeries, ErrorBars } from '@/charts-v2/series';
import { XAxis, YAxis } from '@/charts-v2/axes';
```

---

## 🎯 Current Phase: Phase 2

**Duration:** 8 weeks (Feb 10 - Mar 31)  
**Goal:** Add 15+ chart types, multi-series, legends

### This Week (Week 7)
- [ ] BoxPlot component
- [ ] ViolinPlot component
- [ ] Statistical utilities

### Next Priorities
1. Heatmap
2. Histogram
3. Legend system
4. Multi-series support

---

## 🧪 Testing Locally

```bash
# View in Studio
npm run dev
# Navigate to: http://localhost:5173
# Select: "Simple Line Chart (v2)" or "Simple Bar Chart (v2)"

# Export a figure
npm run render -- --project example --fig simple-line-chart

# Check output
ls out/example/
```

---

## 📊 API Patterns

### Level 1: Auto-Infer Everything
```tsx
<LineChart data={data} width={800} height={600} />
```

### Level 2: Specify Mappings
```tsx
<LineChart 
  data={data} 
  x="time" 
  y="value"
  width={800} 
  height={600}
/>
```

### Level 3: Full Control
```tsx
<LineChart
  data={data}
  x="time"
  y="value"
  xScale={{ type: 'log' }}
  yScale={{ domain: [0, 100] }}
  theme="nature"
  showGrid
  showMarkers
  title="My Chart"
  xLabel="Time (s)"
  yLabel="Signal"
/>
```

### Level 4: Compositional
```tsx
<Chart data={data} x="time" y="value">
  <Title text="Complex Chart" />
  <YAxis showGrid />
  <XAxis />
  <AreaSeries fillOpacity={0.2} />
  <LineSeries />
  <ErrorBars error="stderr" />
</Chart>
```

---

## 🎨 Themes

```tsx
// Use preset
<LineChart data={data} theme="nature" />

// Available themes
'default' | 'nature' | 'science' | 'cell' | 
'minimal' | 'colorblind' | 'print' | 'dark'

// Create custom
import { createTheme } from '@/core/theme-v2';

const myTheme = createTheme({
  extends: 'nature',
  colors: {
    palette: ['#E41A1C', '#377EB8']
  }
});

<LineChart data={data} theme={myTheme} />
```

---

## 📝 Adding a New Component

### 1. Create Component File

```tsx
// src/charts-v2/series/MyNewSeries.tsx
import { useChartContext } from '../ChartContext';

export interface MyNewSeriesProps {
  x?: string;
  y?: string;
  // ... props
}

export function MyNewSeries({ x, y }: MyNewSeriesProps) {
  const ctx = useChartContext();
  // Use ctx.data, ctx.xScale, ctx.yScale, etc.
  
  return (
    <g>
      {/* Your SVG rendering */}
    </g>
  );
}
```

### 2. Export from Index

```tsx
// src/charts-v2/index.ts
export { MyNewSeries } from './series/MyNewSeries';
export type { MyNewSeriesProps } from './series/MyNewSeries';
```

### 3. Create Example Figure

```tsx
// projects/example/figures/my-example.tsx
import { Chart } from '@/charts-v2';
import { MyNewSeries } from '@/charts-v2';

export default function MyExample({ width, height }: FigureComponentBaseProps) {
  return (
    <Chart data={data} width={width} height={height}>
      <MyNewSeries />
    </Chart>
  );
}
```

### 4. Add to Manifest

```tsx
// projects/example/manifest.ts
{
  id: 'my-example',
  title: 'My Example',
  moduleKey: 'my-example',
  size: { unit: 'px', width: 800, height: 600 },
  variants: [{ id: 'default', background: 'white', props: {} }]
}
```

### 5. Test

```bash
npm run dev
# View in Studio

npm run build
# Should compile without errors
```

---

## 🐛 Common Issues

### TypeScript Errors

```bash
# Check for errors
npm run build

# Common fixes:
# 1. Import from correct path (@/charts-v2 not ./charts-v2)
# 2. Use ChartContext for data/scales
# 3. Handle scale types (band vs linear)
```

### Component Not Showing

```tsx
// Check:
1. Is xField/yField defined?
2. Are xScale/yScale available?
3. Console warnings in browser?
4. SVG elements being created?
```

### Data Not Rendering

```tsx
// Debug:
console.log('ctx.data:', ctx.data);
console.log('xScale:', ctx.xScale);
console.log('yScale:', ctx.yScale);
```

---

## 📚 Resources

### Documentation
- [Master Plan](./docs/MASTER_PLAN.md) - Complete roadmap
- [Progress Tracker](./docs/PROGRESS.md) - Current status
- [Implementation Guide](./IMPLEMENTATION.md) - Usage examples
- [Analysis](./ANALYSIS.md) - Comprehensive analysis

### Code Examples
- `projects/example/figures/simple-line-chart.tsx`
- `projects/example/figures/simple-bar-chart.tsx`
- More in v1: `projects/example/figures/*.tsx`

### External References
- [D3 Documentation](https://d3js.org/)
- [React Documentation](https://react.dev/)
- [SVG Specification](https://www.w3.org/TR/SVG2/)

---

## 🎯 Current Metrics

```
Components:   10 / 100+  (10%)
Phases:       1 / 9      (11%)
Build Time:   507ms      (✅ <1s)
Bundle Size:  34.71 KB   (✅ <200KB)
TS Errors:    0          (✅)
```

---

## 🤝 Contributing Guidelines

1. **Follow existing patterns** - Study current components
2. **Use ChartContext** - Don't duplicate data/scale logic
3. **Type everything** - Full TypeScript types
4. **Add examples** - Create demo figure
5. **Update docs** - Add to PROGRESS.md
6. **Test locally** - Run dev server and build

---

## 🚦 Git Workflow

```bash
# Create feature branch
git checkout -b feature/boxplot-component

# Make changes
# ... code ...

# Commit with conventional commits
git commit -m "feat(charts): add BoxPlot component"

# Push and create PR
git push origin feature/boxplot-component
```

### Commit Prefixes

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

---

## ⚡ Performance Tips

1. **Memoize expensive calculations**
2. **Use keys in map iterations**
3. **Avoid unnecessary re-renders**
4. **Lazy load domain-specific modules**
5. **Virtualize for large datasets**

---

## 📞 Getting Help

1. Check existing components for patterns
2. Read `IMPLEMENTATION.md` for API examples
3. Review `MASTER_PLAN.md` for phase details
4. Look at example figures in `projects/example/`

---

**Last Updated:** 2026-02-09  
**Current Phase:** 2 (Comprehensive Charts)  
**Next Milestone:** BoxPlot Component (Week 7)
