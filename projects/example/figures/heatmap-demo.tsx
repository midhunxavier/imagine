/**
 * Demo: Heatmap for correlation matrix visualization
 */

import { HeatmapChart } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Generate a correlation matrix
const generateCorrelationMatrix = () => {
  const variables = ['Temperature', 'Humidity', 'Pressure', 'Wind Speed', 'Rainfall'];
  const n = variables.length;
  
  // Create a symmetric correlation matrix
  const matrix: number[][] = [];
  
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1; // Perfect correlation with self
      } else if (i > j) {
        matrix[i][j] = matrix[j][i]; // Symmetric
      } else {
        // Random correlation between -1 and 1
        const corr = (Math.random() * 2 - 1) * 0.8; // Scale to [-0.8, 0.8]
        matrix[i][j] = Math.round(corr * 100) / 100;
      }
    }
  }
  
  return { matrix, variables };
};

const { matrix, variables } = generateCorrelationMatrix();

export default function HeatmapDemo({ width, height, background }: FigureComponentBaseProps) {
  return (
    <HeatmapChart
      matrix={matrix}
      rowLabels={variables}
      colLabels={variables}
      width={width}
      height={height}
      background={background}
      title="Weather Variables Correlation Matrix"
      colorScale="rdbu"
      domain={[-1, 1]}
      cellSize={50}
      cellGap={2}
      showValues
      valueFormat={(v: number) => v.toFixed(2)}
      theme="minimal"
    />
  );
}
