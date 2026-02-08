/**
 * Demo: ViolinPlot for distribution density visualization
 */

import { ViolinPlotChart } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Generate sample data with different distribution shapes
const generateViolinData = () => {
  const groups = ['Normal', 'Bimodal', 'Skewed', 'Uniform'];
  const data: Array<{ group: string; value: number }> = [];

  groups.forEach((group, idx) => {
    const n = 150;

    for (let i = 0; i < n; i++) {
      let value: number;

      if (group === 'Normal') {
        // Normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        value = 50 + z0 * 10;
      } else if (group === 'Bimodal') {
        // Bimodal distribution (mixture of two normals)
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const mode = Math.random() < 0.5 ? 35 : 65;
        value = mode + z0 * 6;
      } else if (group === 'Skewed') {
        // Right-skewed distribution (gamma-like)
        const u = Math.random();
        value = 30 + Math.pow(u, 0.3) * 50;
      } else {
        // Uniform distribution
        value = 20 + Math.random() * 60;
      }

      data.push({ group, value });
    }
  });

  return data;
};

const data = generateViolinData();

export default function ViolinPlotDemo({ width, height, background }: FigureComponentBaseProps) {
  return (
    <ViolinPlotChart
      data={data}
      width={width}
      height={height}
      background={background}
      x="group"
      y="value"
      title="Distribution Shapes Comparison"
      xLabel="Distribution Type"
      yLabel="Value"
      theme="colorblind"
      showQuartiles
      showMedian
      bandwidth="auto"
    />
  );
}
