/**
 * Histogram Demo - Distribution visualization with auto-binning
 */

import { HistogramChart } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Generate sample data: mixture of normal distributions
function generateData() {
  const data: { value: number }[] = [];
  
  // Component 1: Normal(10, 2)
  for (let i = 0; i < 300; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push({ value: 10 + z * 2 });
  }
  
  // Component 2: Normal(18, 1.5)
  for (let i = 0; i < 200; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push({ value: 18 + z * 1.5 });
  }
  
  return data;
}

// Grouped histogram data
function generateGroupedData() {
  const groups = ['Control', 'Treatment A', 'Treatment B'];
  const data: { group: string; value: number }[] = [];
  
  groups.forEach((group, idx) => {
    const mean = 10 + idx * 3;
    const std = 2;
    
    for (let i = 0; i < 150; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      data.push({ group, value: mean + z * std });
    }
  });
  
  return data;
}

export default function HistogramDemo(props: FigureComponentBaseProps & { variant?: string }) {
  const { variant = 'default', ...figureProps } = props;

  // Generate appropriate data
  const isGrouped = variant === 'grouped';
  const data = isGrouped ? generateGroupedData() : generateData();

  if (variant === 'with-density') {
    return (
      <HistogramChart
        {...figureProps}
        data={data}
        x="value"
        bins={30}
        normalize
        showDensity
        densityBandwidth="auto"
        title="Normalized Histogram with Density Overlay"
        xLabel="Measurement"
        yLabel="Density"
        theme="science"
        showGrid="y"
      />
    );
  }

  if (variant === 'grouped') {
    return (
      <HistogramChart
        {...figureProps}
        data={data}
        x="group"
        y="value"
        bins={20}
        title="Grouped Histograms"
        xLabel="Treatment Group"
        yLabel="Frequency"
        theme="cell"
        showGrid="y"
      />
    );
  }

  if (variant === 'custom-bins') {
    // Custom bin edges
    const customBins = [0, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25];
    
    return (
      <HistogramChart
        {...figureProps}
        data={data}
        x="value"
        bins={customBins}
        title="Custom Bin Edges"
        xLabel="Measurement"
        yLabel="Count"
        theme="colorblind"
        showGrid="y"
      />
    );
  }

  // Default variant
  return (
    <HistogramChart
      {...figureProps}
      data={data}
      x="value"
      bins="fd"
      title="Distribution with Auto-Binning"
      xLabel="Measurement"
      yLabel="Frequency"
      theme="nature"
      showGrid="y"
    />
  );
}

