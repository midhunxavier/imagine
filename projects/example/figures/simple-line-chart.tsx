/**
 * Demo: Simple LineChart with auto-inference
 */

import { LineChart } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Sample time series data
const generateTimeSeriesData = (n: number, seed: number = 1) => {
  const data = [];
  let value = 50;
  for (let i = 0; i < n; i++) {
    value += (Math.random() - 0.5) * 10;
    data.push({
      time: i,
      value: Math.max(0, value),
      category: i % 2 === 0 ? 'A' : 'B'
    });
  }
  return data;
};

const data = generateTimeSeriesData(20);

export default function SimpleLineChartDemo({ width, height, background }: FigureComponentBaseProps) {
  return (
    <LineChart
      data={data}
      width={width}
      height={height}
      background={background}
      x="time"
      y="value"
      title="Auto-Inferred Line Chart"
      xLabel="Time (arbitrary units)"
      yLabel="Signal Value"
      theme="default"
      showGrid
      showMarkers
    />
  );
}
