/**
 * Enhanced Line Series Component
 */

import { useEffect, useMemo } from 'react';
import { line as d3Line, curveMonotoneX, curveLinear, curveBasis, curveStep } from 'd3-shape';
import type { ScaleLinear, ScaleTime } from 'd3-scale';
import { useChartContext } from '../ChartContext';

export type CurveType = 'linear' | 'monotone' | 'basis' | 'step';

export interface LineSeriesProps {
  // Data field mappings (uses Chart context if not provided)
  x?: string;
  y?: string;

  // Appearance
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  curve?: CurveType;

  // Label for legend
  label?: string;

  // Data override (uses Chart data if not provided)
  data?: any[];
}

const curves = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  basis: curveBasis,
  step: curveStep
};

export function LineSeries({
  x: xProp,
  y: yProp,
  stroke,
  strokeWidth,
  opacity = 1,
  curve = 'monotone',
  label,
  data: dataProp
}: LineSeriesProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const color = stroke || ctx.getColor(0);

  // Generate unique ID for this series
  const seriesId = useMemo(() => {
    return `line-${label || yField || Math.random().toString(36).substr(2, 9)}`;
  }, [label, yField]);

  // Register series with context for legend
  useEffect(() => {
    if (label) {
      ctx.registerSeries({
        id: seriesId,
        label,
        color,
        shape: 'line'
      });
    }
    return () => {
      if (label) {
        ctx.unregisterSeries(seriesId);
      }
    };
  }, [seriesId, label, color, ctx]);

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('LineSeries: missing x or y field/scale');
    return null;
  }

  // Create line generator
  const lineGenerator = d3Line()
    .x((d: any) => {
      const value = d[xField];
      // Handle different scale types
      if ('bandwidth' in xScale) {
        // Band scale - use band center
        return (xScale(String(value)) || 0) + (xScale.bandwidth?.() || 0) / 2;
      }
      return xScale(value) as number;
    })
    .y((d: any) => yScale(d[yField]) as number)
    .curve(curves[curve]);

  const pathData = lineGenerator(data);

  if (!pathData) return null;

  return (
    <path
      d={pathData}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth || ctx.theme.strokes.thick}
      opacity={opacity}
      data-label={label}
    />
  );
}
