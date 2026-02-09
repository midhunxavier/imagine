# Imagine Charts v2

A modern, high-performance React visualization library for scientific and technical domains.

## 🌟 Key Features

- **Smart Auto-Inference**: Automatically detects data types and scales.
- **Domain Specific**: Specialized components for Biology, Chemistry, Physics, and Engineering.
- **Publication Ready**: Built-in themes (Nature, Science, etc.) and high-DPI export.
- **Performance**: Hybrid SVG/Canvas rendering for handling large datasets.
- **Responsive**: Auto-resizing charts that fit any container.

## 📦 Installation

```bash
npm install imagine-charts
# or imports from local source if internal
```

## 🚀 Quick Start

```tsx
import { LineChart } from '@/charts-v2';

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 }
];

export const MyChart = () => (
  <LineChart 
    data={data} 
    width={600} 
    height={400} 
    theme="nature"
  />
);
```

## 📚 Component Reference

### Core Charts
- `LineChart`: Time-series and continuous data.
- `ScatterPlot`: Correlation and distribution.
- `BarChart`: Categorical comparisons.
- `AreaChart`: Volume and cumulative trends.
- `Heatmap`: 2D matrix visualization.

### Statistical
- `BoxPlot`: Distribution summary with quartiles.
- `ViolinPlot`: Density estimation.
- `Histogram`: Frequency distribution.
- `DensityPlot`: Smooth kernel density estimation.
- `ErrorBars`: Uncertainty visualization.

### Biology
- `PhyloTree`: Phylogenetic trees (Newick format).
- `SequenceLogo`: DNA/Protein sequence consensus.

### Chemistry
- `Molecule`: 2D chemical structure rendering (SMILES).
- `NMRSpectrum`: Nuclear Magnetic Resonance spectra.
- `MassSpectrum`: Mass spectrometry peaks.
- `IRSpectrum`: Infrared spectroscopy.

### Physics & Math
- `VectorField`: 2D flow and force fields.
- `ParametricPlot`: Curves defined by `x(t), y(t)`.
- `PolarPlot`: Data in polar coordinates.
- `ContourPlot`: Scalar field isolines.
- `PhaseDiagram`: State transitions.

### Engineering
- `Flowchart`: Process diagrams.
- `NetworkGraph`: Node-link relationships.
- `SankeyDiagram`: Flow magnitude visualization.
- `SystemDiagram`: Control system blocks.

### Advanced Features
- `SignificanceBracket`: Statistical comparison markers (* p<0.05).
- `ScaleBar`: Physical measurement scales.
- `DataAnnotation`: Callouts and labels.
- `HighlightRegion`: Emphasis for specific data ranges.

### Export & Integration
- `ResponsiveChart`: Wrapper for auto-sizing.
- `ExportControls`: UI for PNG/SVG download.
- `CanvasScatterSeries`: High-performance rendering for >5k points.

## 🎨 Theming

Use built-in themes or create your own:

```tsx
import { Chart, createTheme } from '@/charts-v2';

const myTheme = createTheme({
  extends: 'default',
  colors: {
    palette: ['#FF5733', '#33FF57', '#3357FF']
  }
});

<Chart theme={myTheme} ... />
```

Available presets: `default`, `nature`, `science`, `cell`, `minimal`, `dark`, `print`.

## 🛠️ Exporting

```tsx
import { ResponsiveChart, ExportControls, Chart } from '@/charts-v2';
import { useRef } from 'react';

const MyFigure = () => {
  const chartRef = useRef(null);
  
  return (
    <div>
      <ExportControls chartRef={chartRef} />
      <div ref={chartRef} style={{ height: 400 }}>
        <ResponsiveChart>
          {({ width, height }) => (
            <Chart width={width} height={height} ... />
          )}
        </ResponsiveChart>
      </div>
    </div>
  );
};
```
