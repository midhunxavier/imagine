/**
 * BoxPlot Component - Statistical distribution visualization
 */

import { useChartContext } from '../ChartContext';
import { boxPlotStats, type BoxPlotStats } from '../utils/statistics';

export interface BoxPlotProps {
  // Data field mappings
  x?: string; // Category field (for grouped box plots)
  y?: string; // Values field

  // Appearance
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  boxWidth?: number; // As fraction of band width (default 0.6)

  // Features
  showOutliers?: boolean;
  showNotch?: boolean;
  whiskerType?: 'tukey' | 'minmax'; // 1.5*IQR or min/max

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function BoxPlot({
  x: xProp,
  y: yProp,
  fill,
  stroke,
  strokeWidth,
  opacity = 1,
  boxWidth = 0.6,
  showOutliers = true,
  showNotch = false,
  whiskerType = 'tukey',
  label,
  data: dataProp
}: BoxPlotProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;
  const boxColor = fill || ctx.getColor(0);
  const boxStroke = stroke || ctx.theme.colors.foreground;
  const lineWidth = strokeWidth || ctx.theme.strokes.normal;

  if (!xField || !yField || !xScale || !yScale) {
    console.warn('BoxPlot: missing x or y field/scale');
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
    console.warn('BoxPlot: requires a band scale for x axis');
    return null;
  }

  const bandwidth = xScale.bandwidth();
  const actualBoxWidth = bandwidth * boxWidth;

  return (
    <g data-label={label}>
      {Array.from(groups.entries()).map(([category, values], idx) => {
        const stats = boxPlotStats(values, whiskerType);
        const centerX = (xScale(category) || 0) + bandwidth / 2;

        // Convert to y coordinates
        const yMin = yScale(stats.whiskerLow as any) as number;
        const yQ1 = yScale(stats.q1 as any) as number;
        const yMedian = yScale(stats.median as any) as number;
        const yQ3 = yScale(stats.q3 as any) as number;
        const yMax = yScale(stats.whiskerHigh as any) as number;

        const boxHeight = Math.abs(yQ1 - yQ3);
        const boxY = Math.min(yQ1, yQ3);

        // Notch calculations (McGill et al. 1978)
        let notchWidth = 0;
        if (showNotch && values.length > 1) {
          // Notch extends to median ± 1.58*IQR/sqrt(n)
          const iqr = stats.q3 - stats.q1;
          const notchSize = 1.58 * iqr / Math.sqrt(values.length);
          const notchTop = yScale((stats.median - notchSize) as any) as number;
          const notchBottom = yScale((stats.median + notchSize) as any) as number;
          notchWidth = actualBoxWidth * 0.3;
        }

        return (
          <g key={idx}>
            {/* Whisker lines */}
            <line
              x1={centerX}
              y1={yMin}
              x2={centerX}
              y2={yQ1}
              stroke={boxStroke}
              strokeWidth={lineWidth}
              opacity={opacity}
            />
            <line
              x1={centerX}
              y1={yQ3}
              x2={centerX}
              y2={yMax}
              stroke={boxStroke}
              strokeWidth={lineWidth}
              opacity={opacity}
            />

            {/* Whisker caps */}
            <line
              x1={centerX - actualBoxWidth / 4}
              y1={yMin}
              x2={centerX + actualBoxWidth / 4}
              y2={yMin}
              stroke={boxStroke}
              strokeWidth={lineWidth}
              opacity={opacity}
            />
            <line
              x1={centerX - actualBoxWidth / 4}
              y1={yMax}
              x2={centerX + actualBoxWidth / 4}
              y2={yMax}
              stroke={boxStroke}
              strokeWidth={lineWidth}
              opacity={opacity}
            />

            {/* Box (IQR) */}
            {showNotch && notchWidth > 0 ? (
              // Box with notches
              <path
                d={`
                  M ${centerX - actualBoxWidth / 2} ${yQ1}
                  L ${centerX - actualBoxWidth / 2} ${yMedian - notchWidth}
                  L ${centerX - actualBoxWidth / 4} ${yMedian}
                  L ${centerX - actualBoxWidth / 2} ${yMedian + notchWidth}
                  L ${centerX - actualBoxWidth / 2} ${yQ3}
                  L ${centerX + actualBoxWidth / 2} ${yQ3}
                  L ${centerX + actualBoxWidth / 2} ${yMedian + notchWidth}
                  L ${centerX + actualBoxWidth / 4} ${yMedian}
                  L ${centerX + actualBoxWidth / 2} ${yMedian - notchWidth}
                  L ${centerX + actualBoxWidth / 2} ${yQ1}
                  Z
                `}
                fill={boxColor}
                stroke={boxStroke}
                strokeWidth={lineWidth}
                opacity={opacity}
              />
            ) : (
              <rect
                x={centerX - actualBoxWidth / 2}
                y={boxY}
                width={actualBoxWidth}
                height={boxHeight}
                fill={boxColor}
                stroke={boxStroke}
                strokeWidth={lineWidth}
                opacity={opacity}
              />
            )}

            {/* Median line */}
            <line
              x1={centerX - actualBoxWidth / 2}
              y1={yMedian}
              x2={centerX + actualBoxWidth / 2}
              y2={yMedian}
              stroke={boxStroke}
              strokeWidth={lineWidth * 1.5}
              opacity={opacity}
            />

            {/* Outliers */}
            {showOutliers &&
              stats.outliers.map((outlier, i) => {
                const yOutlier = yScale(outlier as any) as number;
                return (
                  <circle
                    key={`outlier-${i}`}
                    cx={centerX}
                    cy={yOutlier}
                    r={3}
                    fill="none"
                    stroke={boxStroke}
                    strokeWidth={lineWidth}
                    opacity={opacity}
                  />
                );
              })}
          </g>
        );
      })}
    </g>
  );
}
