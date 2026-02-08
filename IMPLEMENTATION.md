# Imagine v2: Enhanced Scientific Visualization

## Overview

Imagine v2 introduces a **major redesign** with a focus on **maximum simplicity** and **auto-inference** while maintaining full customization capabilities. This implementation represents the foundation of a 6+ month enhancement plan to transform Imagine into a comprehensive scientific visualization platform.

## What's New in V2

### 🎯 Smart Auto-Inference

Charts now automatically detect data types and create appropriate scales:

```tsx
// Before (v1): Manual scale creation
const xScale = linearScale(extentX(data), [0, plotW]);
const yScale = linearScale(extentY(data), [plotH, 0]);

// After (v2): Automatic
<LineChart data={data} width={800} height={600} />
```

### 🎨 Enhanced Theme System

8 built-in themes including journal-specific presets:
- `default` - Clean, professional
- `nature` - Nature journal style
- `science` - Science journal style  
- `cell` - Cell Press style
- `minimal` - Ultra-clean
- `colorblind` - Okabe-Ito palette
- `print` - Grayscale-optimized
- `dark` - Dark mode for presentations

### 📊 Simplified Chart API

Progressive complexity - start simple, add detail as needed:

```tsx
// Level 1: Just data
<LineChart data={timeSeries} />

// Level 2: Specify mappings
<LineChart data={data} x="time" y="value" />

// Level 3: Full customization
<LineChart 
  data={data}
  x="time"
  y="value"
  title="Temperature over Time"
  xLabel="Time (hours)"
  yLabel="Temperature (°C)"
  theme="nature"
  showGrid
  showMarkers
/>
```

## Architecture

```
src/
├── core/                        # Foundation systems
│   ├── data-types.ts           # Field type inference
│   ├── scales-v2.ts            # Smart scale creation
│   ├── layout.ts               # Adaptive margins
│   └── theme-v2.ts             # Theme system
│
├── charts-v2/                   # New chart components
│   ├── Chart.tsx               # Smart chart container
│   ├── ChartContext.tsx        # Data/scale context
│   ├── SimpleCharts.tsx        # All-in-one components
│   ├── series/
│   │   ├── LineSeries.tsx
│   │   ├── ScatterSeries.tsx
│   │   ├── BarSeries.tsx
│   │   ├── AreaSeries.tsx
│   │   └── ErrorBars.tsx
│   ├── axes/
│   │   └── Axes.tsx            # Enhanced X/Y axes
│   └── decorations/
│       └── Title.tsx
│
└── framework/                   # Original v1 components
    ├── Figure.tsx
    ├── charts/
    ├── diagrams/
    ├── layout/
    └── math/
```

## Components Implemented

### Phase 1 (Foundation) - COMPLETED ✅

| Component | Description | Status |
|-----------|-------------|--------|
| **Smart Inference Engine** | Auto-detect field types, domains, scales | ✅ |
| **Theme System v2** | 8 presets, full customization | ✅ |
| **LineChart** | Simple one-liner line charts | ✅ |
| **ScatterPlot** | Simple scatter plots | ✅ |
| **BarChart** | Vertical/horizontal bar charts | ✅ |
| **AreaSeries** | Filled area charts | ✅ |
| **ErrorBars** | Symmetric/asymmetric error bars | ✅ |
| **Enhanced Axes** | Auto-formatting, grid lines | ✅ |
| **Adaptive Margins** | Auto-compute based on content | ✅ |

## Usage Examples

### Line Chart

```tsx
import { LineChart } from '@/charts-v2';

const data = [
  { time: 0, value: 10 },
  { time: 1, value: 20 },
  { time: 2, value: 15 }
];

function MyFigure({ width, height }) {
  return (
    <LineChart
      data={data}
      x="time"
      y="value"
      width={width}
      height={height}
      title="Simple Line Chart"
      xLabel="Time (s)"
      yLabel="Value"
      theme="nature"
      showGrid
      showMarkers
    />
  );
}
```

### Bar Chart

```tsx
import { BarChart } from '@/charts-v2';

const data = [
  { category: 'A', value: 23 },
  { category: 'B', value: 45 },
  { category: 'C', value: 34 }
];

<BarChart
  data={data}
  x="category"
  y="value"
  width={700}
  height={450}
  theme="science"
  cornerRadius={4}
/>
```

### Advanced: Compositional API

For full control, use the compositional API:

```tsx
import { Chart } from '@/charts-v2';
import { LineSeries, AreaSeries, ErrorBars } from '@/charts-v2/series';
import { XAxis, YAxis } from '@/charts-v2/axes';
import { Title } from '@/charts-v2/decorations';

<Chart
  data={data}
  width={800}
  height={600}
  x="time"
  y="mean"
  theme="colorblind"
>
  <Title text="Advanced Chart" subtitle="With error bands" />
  <YAxis showGrid />
  <XAxis />
  <AreaSeries y="ci_high" y0="ci_low" fillOpacity={0.2} />
  <LineSeries />
  <ErrorBars error="stderr" />
</Chart>
```

## Auto-Inference Details

### Field Type Detection

The system automatically detects four field types:

1. **Quantitative** - Numeric values (uses linear or log scales)
2. **Temporal** - Dates/times (uses time scales)
3. **Ordinal** - Categorical with order (uses band scales)
4. **Nominal** - Categorical without order (uses band scales)

### Scale Selection

Scales are automatically selected based on data:

- **Quantitative + large range (>100x)** → Log scale
- **Quantitative + normal range** → Linear scale (with nice rounding)
- **Temporal** → Time scale (with appropriate tick formatting)
- **Ordinal/Nominal** → Band scale (for bar charts, categorical axes)

### Default Field Selection

When `x` and `y` are not specified:
- **X axis**: First temporal, ordinal, or quantitative field
- **Y axis**: First quantitative field (not used for X)

## Theme Customization

Create custom themes:

```tsx
import { createTheme, themes } from '@/core/theme-v2';

const myTheme = createTheme({
  extends: 'nature',
  colors: {
    palette: ['#E41A1C', '#377EB8', '#4DAF4A'],
    accent: '#2563EB'
  },
  typography: {
    sizes: {
      title: 16,
      label: 12
    }
  }
});

<LineChart data={data} theme={myTheme} />
```

## Roadmap

### Phase 2: Comprehensive Charts (Next)
- Box plots, violin plots
- Heatmaps, correlation matrices
- Statistical visualizations

### Phase 3-6: Domain-Specific
- Biology (phylogenetic trees, pathways, sequences)
- Chemistry (molecules, spectra, reactions)
- Engineering (flowcharts, network graphs)
- Physics (vector fields, phase diagrams)

### Phase 7-8: Advanced Features
- Enhanced annotations (significance brackets, scale bars)
- Multi-format export (PDF, TIFF, EPS)
- Flexible layouts

### Phase 9: Polish
- Comprehensive documentation
- Visual regression testing
- Performance optimization

## Migration from V1

V1 components remain fully functional. To use V2:

```tsx
// V1 (still works)
import { Figure } from '@/framework/Figure';
import { LineSeries } from '@/framework/charts/Series';

// V2 (new simplified API)
import { LineChart } from '@/charts-v2';
```

## Contributing

This is the foundation of a comprehensive enhancement. Priority areas:

1. Additional series types (BoxSeries, ViolinSeries, HeatmapSeries)
2. Enhanced statistical graphics
3. Domain-specific components
4. Export functionality
5. Documentation and examples

## Testing

Run the development server to see examples:

```bash
npm run dev
```

Navigate to the "Simple Line Chart (v2)" and "Simple Bar Chart (v2)" examples.

Build production output:

```bash
npm run build
npm run render -- --project example --fig simple-line-chart
```

## License

[Your License Here]
