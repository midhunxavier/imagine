/**
 * DensityPlot Demo - Kernel density estimation visualization
 */

import { DensityPlotChart, Chart, DensityPlot, XAxis, YAxis, Title } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Generate sample data: normal distribution
function generateNormalData(mean: number, std: number, n: number) {
  const data: { value: number }[] = [];
  
  for (let i = 0; i < n; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    data.push({ value: mean + z * std });
  }
  
  return data;
}

// Multiple overlapping distributions
function generateMultipleDistributions() {
  const data: { value: number; distribution: string }[] = [];
  
  // Distribution 1
  const d1 = generateNormalData(10, 2, 300);
  d1.forEach(d => data.push({ ...d, distribution: 'A' }));
  
  // Distribution 2
  const d2 = generateNormalData(15, 1.5, 300);
  d2.forEach(d => data.push({ ...d, distribution: 'B' }));
  
  // Distribution 3
  const d3 = generateNormalData(18, 2.5, 300);
  d3.forEach(d => data.push({ ...d, distribution: 'C' }));
  
  return data;
}

// Ridge plot data
function generateRidgeData() {
  const categories = ['2020', '2021', '2022', '2023', '2024'];
  const data: { year: string; temperature: number }[] = [];
  
  categories.forEach((year, idx) => {
    const mean = 20 + idx * 0.5; // Warming trend
    const std = 3;
    
    for (let i = 0; i < 200; i++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      data.push({ year, temperature: mean + z * std });
    }
  });
  
  return data;
}

export default function DensityPlotDemo(props: FigureComponentBaseProps & { variant?: string }) {
  const { variant = 'default', ...figureProps } = props;

  if (variant === 'overlapping') {
    const allData = generateMultipleDistributions();
    const dataA = allData.filter(d => d.distribution === 'A');
    const dataB = allData.filter(d => d.distribution === 'B');
    const dataC = allData.filter(d => d.distribution === 'C');

    return (
      <Chart
        {...figureProps}
        data={allData}
        x="value"
        title="Multiple Overlapping Distributions"
        xLabel="Measurement"
        yLabel="Density"
        theme="science"
        showGrid="y"
      >
        <Title text="Multiple Overlapping Distributions" />
        <YAxis showGrid />
        <XAxis />
        <DensityPlot data={dataA} bandwidth="auto" fillOpacity={0.2} />
        <DensityPlot data={dataB} bandwidth="auto" fillOpacity={0.2} />
        <DensityPlot data={dataC} bandwidth="auto" fillOpacity={0.2} />
      </Chart>
    );
  }

  if (variant === 'ridge') {
    const data = generateRidgeData();

    return (
      <DensityPlotChart
        {...figureProps}
        data={data}
        x="year"
        y="temperature"
        ridge
        ridgeOverlap={0.6}
        bandwidth="auto"
        filled
        title="Temperature Distributions by Year (Ridge Plot)"
        xLabel="Year"
        yLabel="Temperature (°C)"
        theme="cell"
      />
    );
  }

  if (variant === 'bandwidth') {
    const data = generateNormalData(15, 3, 500);

    return (
      <Chart
        {...figureProps}
        data={data}
        x="value"
        title="Bandwidth Selection Comparison"
        xLabel="Measurement"
        yLabel="Density"
        theme="colorblind"
        showGrid="y"
      >
        <Title text="Bandwidth Selection Comparison" />
        <YAxis showGrid />
        <XAxis />
        <DensityPlot bandwidth={0.5} filled={false} strokeWidth={2} label="h=0.5" />
        <DensityPlot bandwidth="auto" filled={false} strokeWidth={2} label="h=auto (Silverman)" />
        <DensityPlot bandwidth={2} filled={false} strokeWidth={2} label="h=2.0" />
      </Chart>
    );
  }

  if (variant === 'outline') {
    const data = generateNormalData(15, 3, 500);

    return (
      <DensityPlotChart
        {...figureProps}
        data={data}
        x="value"
        bandwidth="auto"
        filled={false}
        title="Density Curve (Outline)"
        xLabel="Measurement"
        yLabel="Density"
        theme="minimal"
        showGrid="y"
      />
    );
  }

  // Default variant
  const data = generateNormalData(15, 3, 500);

  return (
    <DensityPlotChart
      {...figureProps}
      data={data}
      x="value"
      bandwidth="auto"
      filled
      title="Kernel Density Estimation"
      xLabel="Measurement"
      yLabel="Density"
      theme="nature"
      showGrid="y"
    />
  );
}

