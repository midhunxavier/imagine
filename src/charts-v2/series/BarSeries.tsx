/**
 * Bar Series Component
 */

import { useChartContext } from '../ChartContext';

export interface BarSeriesProps {
  // Data field mappings
  x?: string;
  y?: string;

  // Appearance
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  cornerRadius?: number;

  // Orientation
  horizontal?: boolean;

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function BarSeries({
  x: xProp,
  y: yProp,
  fill,
  stroke,
  strokeWidth = 0,
  opacity = 1,
  cornerRadius = 0,
  horizontal = false,
  label,
  data: dataProp
}: BarSeriesProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const color = fill || ctx.getColor(0);

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('BarSeries: missing x or y field/scale');
    return null;
  }

  // For vertical bars, x should be band scale
  // For horizontal bars, y should be band scale
  const bandScale = horizontal ? yScale : xScale;
  const valueScale = horizontal ? xScale : yScale;

  if (!('bandwidth' in bandScale)) {
    console.warn('BarSeries: requires a band scale for categorical axis');
    return null;
  }

  const bandwidth = bandScale.bandwidth();
  const zeroPos = 'invert' in valueScale ? valueScale(0) as number : 0;

  return (
    <g data-label={label}>
      {data.map((d, i) => {
        const categoryValue = horizontal ? d[yField] : d[xField];
        const numericValue = horizontal ? d[xField] : d[yField];

        const bandPos = bandScale(String(categoryValue)) || 0;
        const valuePos = valueScale(numericValue) as number;

        if (horizontal) {
          // Horizontal bars
          const x = Math.min(zeroPos, valuePos);
          const width = Math.abs(valuePos - zeroPos);
          const y = bandPos;
          const height = bandwidth;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={color}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
              rx={cornerRadius}
              ry={cornerRadius}
            />
          );
        } else {
          // Vertical bars
          const x = bandPos;
          const width = bandwidth;
          const y = Math.min(zeroPos, valuePos);
          const height = Math.abs(valuePos - zeroPos);

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={height}
              fill={color}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
              rx={cornerRadius}
              ry={cornerRadius}
            />
          );
        }
      })}
    </g>
  );
}
