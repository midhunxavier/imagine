/**
 * Multi-Series Demo - Multiple lines with legend
 */

import { Chart, LineSeries, ScatterSeries, AreaSeries, XAxis, YAxis, Title, Legend } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Generate time series data
function generateTimeSeriesData() {
  const data: Array<{ time: number; series1: number; series2: number; series3: number }> = [];
  
  for (let t = 0; t <= 50; t++) {
    const time = t;
    const series1 = 10 + 5 * Math.sin(t * 0.3) + Math.random() * 2;
    const series2 = 15 + 4 * Math.cos(t * 0.25) + Math.random() * 2;
    const series3 = 12 + 3 * Math.sin(t * 0.2 + 1) + Math.random() * 1.5;
    
    data.push({ time, series1, series2, series3 });
  }
  
  return data;
}

export default function MultiSeriesDemo(props: FigureComponentBaseProps & { variant?: string }) {
  const { variant = 'default', ...figureProps } = props;

  if (variant === 'with-markers') {
    const data = generateTimeSeriesData();

    return (
      <Chart
        {...figureProps}
        data={data}
        x="time"
        title="Multi-Series Line Chart with Markers"
        xLabel="Time (s)"
        yLabel="Signal"
        theme="nature"
        showGrid="y"
      >
        <Title text="Multi-Series Line Chart with Markers" />
        <YAxis showGrid />
        <XAxis />
        <LineSeries y="series1" label="Condition A" strokeWidth={2} />
        <ScatterSeries y="series1" r={3} />
        <LineSeries y="series2" label="Condition B" strokeWidth={2} />
        <ScatterSeries y="series2" r={3} />
        <LineSeries y="series3" label="Condition C" strokeWidth={2} />
        <ScatterSeries y="series3" r={3} />
        <Legend position="top-right" />
      </Chart>
    );
  }

  if (variant === 'area-stack') {
    const data = generateTimeSeriesData();

    return (
      <Chart
        {...figureProps}
        data={data}
        x="time"
        title="Multi-Series Area Chart"
        xLabel="Time (s)"
        yLabel="Value"
        theme="science"
        showGrid="y"
      >
        <Title text="Multi-Series Area Chart" />
        <YAxis showGrid />
        <XAxis />
        <AreaSeries y="series1" label="Layer 1" fillOpacity={0.4} />
        <AreaSeries y="series2" label="Layer 2" fillOpacity={0.4} />
        <AreaSeries y="series3" label="Layer 3" fillOpacity={0.4} />
        <Legend position="top-right" />
      </Chart>
    );
  }

  if (variant === 'combined') {
    const data = generateTimeSeriesData();

    return (
      <Chart
        {...figureProps}
        data={data}
        x="time"
        title="Combined Series Types"
        xLabel="Time (s)"
        yLabel="Measurement"
        theme="cell"
        showGrid="y"
      >
        <Title text="Combined Series Types" />
        <YAxis showGrid />
        <XAxis />
        <AreaSeries y="series1" label="Background" fillOpacity={0.2} />
        <LineSeries y="series2" label="Primary Signal" strokeWidth={2} />
        <ScatterSeries y="series3" label="Measurements" r={4} />
        <Legend position="top-right" />
      </Chart>
    );
  }

  // Default variant: simple multi-line
  const data = generateTimeSeriesData();

  return (
    <Chart
      {...figureProps}
      data={data}
      x="time"
      title="Multi-Series Line Chart"
      xLabel="Time (s)"
      yLabel="Value"
      theme="default"
      showGrid="y"
    >
      <Title text="Multi-Series Line Chart" />
      <YAxis showGrid />
      <XAxis />
      <LineSeries y="series1" label="Series A" strokeWidth={2} />
      <LineSeries y="series2" label="Series B" strokeWidth={2} />
      <LineSeries y="series3" label="Series C" strokeWidth={2} />
      <Legend position="top-right" />
    </Chart>
  );
}
