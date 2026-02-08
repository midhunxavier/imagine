/**
 * Demo: BoxPlot for statistical distributions
 */

import { BoxPlotChart } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Generate sample data with different distributions
const generateGroupData = () => {
  const groups = ['Control', 'Treatment A', 'Treatment B', 'Treatment C'];
  const data: Array<{ group: string; value: number }> = [];

  groups.forEach((group, idx) => {
    const mean = 50 + idx * 10;
    const stdDev = 8 + idx * 2;
    const n = 80 + Math.floor(Math.random() * 40);

    for (let i = 0; i < n; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = mean + z0 * stdDev;

      data.push({ group, value });
    }

    // Add a few outliers
    if (idx > 0) {
      data.push({ group, value: mean + stdDev * 4 });
      data.push({ group, value: mean - stdDev * 3.5 });
    }
  });

  return data;
};

const data = generateGroupData();

export default function BoxPlotDemo({ width, height, background }: FigureComponentBaseProps) {
  return (
    <BoxPlotChart
      data={data}
      width={width}
      height={height}
      background={background}
      x="group"
      y="value"
      title="Treatment Response Distribution"
      xLabel="Treatment Group"
      yLabel="Response Value"
      theme="science"
      showOutliers
      showNotch
      whiskerType="tukey"
    />
  );
}
