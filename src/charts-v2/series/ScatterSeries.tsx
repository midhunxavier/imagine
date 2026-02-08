/**
 * Enhanced Scatter Series Component
 */

import { useChartContext } from '../ChartContext';

export interface ScatterSeriesProps {
  // Data field mappings
  x?: string;
  y?: string;
  size?: string | number; // Field name or fixed size

  // Appearance
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  r?: number; // Default radius

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function ScatterSeries({
  x: xProp,
  y: yProp,
  size: sizeProp,
  fill,
  stroke,
  strokeWidth = 0,
  opacity = 1,
  r = 3,
  label,
  data: dataProp
}: ScatterSeriesProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const color = fill || ctx.getColor(0);

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('ScatterSeries: missing x or y field/scale');
    return null;
  }

  return (
    <g data-label={label}>
      {data.map((d, i) => {
        const xValue = d[xField];
        const yValue = d[yField];

        // Get x position
        let cx: number;
        if ('bandwidth' in xScale) {
          cx = (xScale(String(xValue)) || 0) + (xScale.bandwidth?.() || 0) / 2;
        } else {
          cx = xScale(xValue) as number;
        }

        const cy = yScale(yValue) as number;

        // Get radius
        const radius = typeof sizeProp === 'string' ? (d[sizeProp] as number) || r : sizeProp || r;

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
      })}
    </g>
  );
}
