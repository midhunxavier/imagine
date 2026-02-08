/**
 * Demo: Simple BarChart with categorical data
 */

import { BarChart } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

const data = [
  { category: 'A', value: 23 },
  { category: 'B', value: 45 },
  { category: 'C', value: 34 },
  { category: 'D', value: 56 },
  { category: 'E', value: 12 }
];

export default function SimpleBarChartDemo({ width, height, background }: FigureComponentBaseProps) {
  return (
    <BarChart
      data={data}
      width={width}
      height={height}
      background={background}
      x="category"
      y="value"
      title="Categorical Bar Chart"
      xLabel="Category"
      yLabel="Value"
      theme="nature"
      cornerRadius={4}
    />
  );
}
