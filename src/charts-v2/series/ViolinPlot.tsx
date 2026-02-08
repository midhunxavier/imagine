/**
 * ViolinPlot Component - Distribution visualization with density
 */

import { useChartContext } from '../ChartContext';
import { boxPlotStats, kde, silvermanBandwidth } from '../utils/statistics';
import { line as d3Line, curveMonotoneY } from 'd3-shape';

export interface ViolinPlotProps {
  // Data field mappings
  x?: string; // Category field
  y?: string; // Values field

  // Appearance
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  violinWidth?: number; // As fraction of band width (default 0.8)

  // Features
  showQuartiles?: boolean;
  showMedian?: boolean;
  bandwidth?: number | 'auto'; // KDE bandwidth

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function ViolinPlot({
  x: xProp,
  y: yProp,
  fill,
  stroke,
  strokeWidth,
  opacity = 0.7,
  violinWidth = 0.8,
  showQuartiles = true,
  showMedian = true,
  bandwidth = 'auto',
  label,
  data: dataProp
}: ViolinPlotProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const violinColor = fill || ctx.getColor(0);
  const violinStroke = stroke || ctx.theme.colors.foreground;
  const lineWidth = strokeWidth || ctx.theme.strokes.normal;

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('ViolinPlot: missing x or y field/scale');
    return null;
  }

  // Group data by x values
  const groups = new Map<string, number[]>();
  for (const d of data) {
    const xValue = String(d[xField]);
    const yValue = d[yField];
    if (typeof yValue === 'number' && !isNaN(yValue)) {
      if (!groups.has(xValue)) {
        groups.set(xValue, []);
      }
      groups.get(xValue)!.push(yValue);
    }
  }

  if (!('bandwidth' in xScale)) {
    console.warn('ViolinPlot: requires a band scale for x axis');
    return null;
  }

  const bandWidth = xScale.bandwidth();
  const maxViolinWidth = bandWidth * violinWidth;

  return (
    <g data-label={label}>
      {Array.from(groups.entries()).map(([category, values], idx) => {
        if (values.length === 0) return null;

        const centerX = (xScale(category) || 0) + bandWidth / 2;

        // Calculate KDE
        const bw = bandwidth === 'auto' ? silvermanBandwidth(values) : bandwidth;
        const density = kde(values, bw, 50);

        if (density.length === 0) return null;

        // Find max density for scaling
        const maxDensity = Math.max(...density.map((d) => d.y));

        // Create violin paths (mirrored density)
        const leftPath: Array<[number, number]> = [];
        const rightPath: Array<[number, number]> = [];

        for (const point of density) {
          const y = yScale(point.x as any) as number;
          const width = (point.y / maxDensity) * (maxViolinWidth / 2);
          leftPath.push([centerX - width, y]);
          rightPath.push([centerX + width, y]);
        }

        // Create closed path
        const lineGenerator = d3Line()
          .x(d => d[0])
          .y(d => d[1])
          .curve(curveMonotoneY);

        const leftPathStr = lineGenerator(leftPath);
        const rightPathStr = lineGenerator(rightPath.reverse());

        const closedPath = `${leftPathStr} L ${rightPath[0][0]} ${rightPath[0][1]} ${rightPathStr} Z`;

        // Calculate quartiles for overlay
        const stats = boxPlotStats(values, 'minmax');
        const yQ1 = yScale(stats.q1 as any) as number;
        const yMedian = yScale(stats.median as any) as number;
        const yQ3 = yScale(stats.q3 as any) as number;

        return (
          <g key={idx}>
            {/* Violin shape */}
            <path
              d={closedPath || ''}
              fill={violinColor}
              stroke={violinStroke}
              strokeWidth={lineWidth}
              opacity={opacity}
            />

            {/* Quartile markers */}
            {showQuartiles && (
              <>
                <line
                  x1={centerX - maxViolinWidth / 4}
                  y1={yQ1}
                  x2={centerX + maxViolinWidth / 4}
                  y2={yQ1}
                  stroke={violinStroke}
                  strokeWidth={lineWidth}
                  opacity={0.8}
                />
                <line
                  x1={centerX - maxViolinWidth / 4}
                  y1={yQ3}
                  x2={centerX + maxViolinWidth / 4}
                  y2={yQ3}
                  stroke={violinStroke}
                  strokeWidth={lineWidth}
                  opacity={0.8}
                />
              </>
            )}

            {/* Median marker */}
            {showMedian && (
              <line
                x1={centerX - maxViolinWidth / 3}
                y1={yMedian}
                x2={centerX + maxViolinWidth / 3}
                y2={yMedian}
                stroke={violinStroke}
                strokeWidth={lineWidth * 1.5}
                opacity={1}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
