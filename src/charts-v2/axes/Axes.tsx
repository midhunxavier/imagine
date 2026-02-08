/**
 * Enhanced Axes Components
 */

import { useChartContext } from '../ChartContext';
import type { ScaleLinear, ScaleTime, ScaleBand } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { format as d3Format } from 'd3-format';

export interface AxisProps {
  // Label
  label?: string;

  // Ticks
  tickCount?: number;
  tickFormat?: (value: any) => string;
  showTicks?: boolean;

  // Grid
  showGrid?: boolean;
}

export function XAxis({ label, tickCount = 5, tickFormat, showTicks = true, showGrid }: AxisProps) {
  const ctx = useChartContext();
  const { xScale, plotWidth, plotHeight, margin, theme, xLabel } = ctx;

  if (!xScale) return null;

  const finalLabel = label || xLabel;

  // Get ticks based on scale type
  let ticks: any[] = [];
  let formatter: (value: any) => string;

  if ('ticks' in xScale) {
    // Linear or time scale
    ticks = xScale.ticks(tickCount);
    formatter = tickFormat || ((v: any) => {
      if (xScale.domain()[0] instanceof Date) {
        return timeFormat('%b %d')(v);
      }
      return d3Format('.2~f')(v);
    });
  } else if ('domain' in xScale) {
    // Band scale
    ticks = xScale.domain();
    formatter = tickFormat || String;
  }

  return (
    <g transform={`translate(${margin.left}, ${margin.top + plotHeight})`}>
      {/* Axis line */}
      <line
        x1={0}
        y1={0}
        x2={plotWidth}
        y2={0}
        stroke={theme.colors.axis}
        strokeWidth={theme.strokes.axis}
      />

      {/* Ticks and labels */}
      {showTicks &&
        ticks.map((tick, i) => {
          const x = 'bandwidth' in xScale 
            ? (xScale(String(tick)) || 0) + xScale.bandwidth() / 2
            : xScale(tick) as number;

          return (
            <g key={i} transform={`translate(${x}, 0)`}>
              <line y2={6} stroke={theme.colors.axis} strokeWidth={theme.strokes.thin} />
              <text
                y={theme.typography.sizes.tick + 12}
                fontSize={theme.typography.sizes.tick}
                fill={theme.colors.foreground}
                textAnchor="middle"
              >
                {formatter(tick)}
              </text>
            </g>
          );
        })}

      {/* Axis label */}
      {finalLabel && (
        <text
          x={plotWidth / 2}
          y={theme.typography.sizes.tick + theme.typography.sizes.label + 20}
          fontSize={theme.typography.sizes.label}
          fill={theme.colors.foreground}
          textAnchor="middle"
        >
          {finalLabel}
        </text>
      )}

      {/* Grid lines */}
      {showGrid &&
        ticks.map((tick, i) => {
          const x = 'bandwidth' in xScale
            ? (xScale(String(tick)) || 0) + xScale.bandwidth() / 2
            : xScale(tick) as number;

          return (
            <line
              key={`grid-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={-plotHeight}
              stroke={theme.colors.grid}
              strokeWidth={theme.strokes.grid}
            />
          );
        })}
    </g>
  );
}

export function YAxis({ label, tickCount = 5, tickFormat, showTicks = true, showGrid }: AxisProps) {
  const ctx = useChartContext();
  const { yScale, plotWidth, plotHeight, margin, theme, yLabel } = ctx;

  if (!yScale) return null;

  const finalLabel = label || yLabel;

  // Get ticks
  let ticks: any[] = [];
  let formatter: (value: any) => string;

  if ('ticks' in yScale) {
    ticks = yScale.ticks(tickCount);
    formatter = tickFormat || d3Format('.2~f');
  } else if ('domain' in yScale) {
    ticks = yScale.domain();
    formatter = tickFormat || String;
  }

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Axis line */}
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={plotHeight}
        stroke={theme.colors.axis}
        strokeWidth={theme.strokes.axis}
      />

      {/* Ticks and labels */}
      {showTicks &&
        ticks.map((tick, i) => {
          const y = 'bandwidth' in yScale
            ? (yScale(String(tick)) || 0) + yScale.bandwidth() / 2
            : yScale(tick) as number;

          return (
            <g key={i} transform={`translate(0, ${y})`}>
              <line x2={-6} stroke={theme.colors.axis} strokeWidth={theme.strokes.thin} />
              <text
                x={-10}
                y={theme.typography.sizes.tick / 3}
                fontSize={theme.typography.sizes.tick}
                fill={theme.colors.foreground}
                textAnchor="end"
              >
                {formatter(tick)}
              </text>
            </g>
          );
        })}

      {/* Axis label */}
      {finalLabel && (
        <text
          x={-plotHeight / 2}
          y={-theme.typography.sizes.label - 35}
          fontSize={theme.typography.sizes.label}
          fill={theme.colors.foreground}
          textAnchor="middle"
          transform={`rotate(-90, ${-plotHeight / 2}, ${-theme.typography.sizes.label - 35})`}
        >
          {finalLabel}
        </text>
      )}

      {/* Grid lines */}
      {showGrid &&
        ticks.map((tick, i) => {
          const y = 'bandwidth' in yScale
            ? (yScale(String(tick)) || 0) + yScale.bandwidth() / 2
            : yScale(tick) as number;

          return (
            <line
              key={`grid-${i}`}
              x1={0}
              y1={y}
              x2={plotWidth}
              y2={y}
              stroke={theme.colors.grid}
              strokeWidth={theme.strokes.grid}
            />
          );
        })}
    </g>
  );
}
