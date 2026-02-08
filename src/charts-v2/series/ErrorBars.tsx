/**
 * Error Bars Component
 */

import { useChartContext } from '../ChartContext';

export interface ErrorBarsProps {
  // Data field mappings
  x?: string;
  y?: string;
  error?: string | number; // Symmetric error (field or constant)
  errorLow?: string | number; // Asymmetric error low
  errorHigh?: string | number; // Asymmetric error high

  // Appearance
  stroke?: string;
  strokeWidth?: number;
  capWidth?: number; // Width of error bar caps

  // Data override
  data?: any[];
}

export function ErrorBars({
  x: xProp,
  y: yProp,
  error: errorProp,
  errorLow: errorLowProp,
  errorHigh: errorHighProp,
  stroke,
  strokeWidth,
  capWidth = 8,
  data: dataProp
}: ErrorBarsProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const color = stroke || ctx.theme.colors.foreground;
  const lineWidth = strokeWidth || ctx.theme.strokes.thin;

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('ErrorBars: missing x or y field/scale');
    return null;
  }

  return (
    <g>
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

        // Calculate error values
        let errorLow: number;
        let errorHigh: number;

        if (errorProp !== undefined) {
          // Symmetric error
          const err = typeof errorProp === 'string' ? (d[errorProp] as number) || 0 : errorProp;
          errorLow = err;
          errorHigh = err;
        } else {
          // Asymmetric error
          errorLow = typeof errorLowProp === 'string' ? (d[errorLowProp] as number) || 0 : errorLowProp || 0;
          errorHigh = typeof errorHighProp === 'string' ? (d[errorHighProp] as number) || 0 : errorHighProp || 0;
        }

        const yLow = yScale((yValue - errorLow) as any) as number;
        const yHigh = yScale((yValue + errorHigh) as any) as number;

        return (
          <g key={i}>
            {/* Vertical line */}
            <line
              x1={cx}
              y1={yLow}
              x2={cx}
              y2={yHigh}
              stroke={color}
              strokeWidth={lineWidth}
            />
            {/* Bottom cap */}
            <line
              x1={cx - capWidth / 2}
              y1={yLow}
              x2={cx + capWidth / 2}
              y2={yLow}
              stroke={color}
              strokeWidth={lineWidth}
            />
            {/* Top cap */}
            <line
              x1={cx - capWidth / 2}
              y1={yHigh}
              x2={cx + capWidth / 2}
              y2={yHigh}
              stroke={color}
              strokeWidth={lineWidth}
            />
          </g>
        );
      })}
    </g>
  );
}
