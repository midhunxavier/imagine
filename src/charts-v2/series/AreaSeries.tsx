/**
 * Area Series Component
 */

import { area as d3Area, curveMonotoneX, curveLinear, curveBasis, curveStep } from 'd3-shape';
import { useChartContext } from '../ChartContext';
import type { CurveType } from './LineSeries';

const curves = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  basis: curveBasis,
  step: curveStep
};

export interface AreaSeriesProps {
  // Data field mappings
  x?: string;
  y?: string;
  y0?: string | number; // Baseline (field name or constant)

  // Appearance
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  curve?: CurveType;

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function AreaSeries({
  x: xProp,
  y: yProp,
  y0: y0Prop = 0,
  fill,
  fillOpacity = 0.3,
  stroke,
  strokeWidth = 0,
  curve = 'monotone',
  label,
  data: dataProp
}: AreaSeriesProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const color = fill || ctx.getColor(0);

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('AreaSeries: missing x or y field/scale');
    return null;
  }

  // Create area generator
  const areaGenerator = d3Area()
    .x((d: any) => {
      const value = d[xField];
      if ('bandwidth' in xScale) {
        return (xScale(String(value)) || 0) + (xScale.bandwidth?.() || 0) / 2;
      }
      return xScale(value) as number;
    })
    .y1((d: any) => yScale(d[yField]) as number)
    .y0((d: any) => {
      if (typeof y0Prop === 'string') {
        return yScale(d[y0Prop]) as number;
      }
      // For constant baseline, use it directly
      if ('range' in yScale && 'invert' in yScale) {
        return yScale(y0Prop as any) as number;
      }
      return 0;
    })
    .curve(curves[curve]);

  const pathData = areaGenerator(data);

  if (!pathData) return null;

  return (
    <path
      d={pathData}
      fill={color}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      data-label={label}
    />
  );
}
