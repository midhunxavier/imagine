/**
 * DensityPlot Component - Kernel density estimation visualization
 */

import { useChartContext } from '../ChartContext';
import { kde, silvermanBandwidth } from '../utils/statistics';

export interface DensityPlotProps {
  // Data field mappings
  x?: string; // Value field (or category field for grouped/ridge plots)
  y?: string; // Value field (when x is categorical for ridge plots)

  // Appearance
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fillOpacity?: number;

  // KDE configuration
  bandwidth?: number | 'auto'; // KDE bandwidth
  numPoints?: number; // Number of points to evaluate KDE (default 100)

  // Features
  filled?: boolean; // Fill area under curve (default true)
  ridge?: boolean; // Ridge plot mode (stacked density plots)
  ridgeOverlap?: number; // Overlap factor for ridge plots (default 0.5)

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function DensityPlot({
  x: xProp,
  y: yProp,
  fill,
  stroke,
  strokeWidth = 2,
  opacity = 1,
  fillOpacity = 0.3,
  bandwidth = 'auto',
  numPoints = 100,
  filled = true,
  ridge = false,
  ridgeOverlap = 0.5,
  label,
  data: dataProp
}: DensityPlotProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;

  if (!data || data.length === 0) return null;

  const theme = ctx.theme;
  const densityFill = fill || ctx.getColor(0);
  const densityStroke = stroke || ctx.getColor(0);

  if (!xScale || !yScale) {
    console.warn('DensityPlot: scales not available');
    return null;
  }

  // Check if we have grouped density plots (categorical x-axis for ridge plots)
  const xType = (xScale as any).bandwidth ? 'categorical' : 'quantitative';

  if (xType === 'categorical' && ridge) {
    // Ridge plot: stacked density plots
    const categories = Array.from(new Set(data.map((d) => d[xField!])));
    const bandWidth = (xScale as any).bandwidth?.() || 0;

    return (
      <g className="density-ridge-group" data-label={label}>
        {categories.map((category, idx) => {
          const categoryData = data.filter((d) => d[xField!] === category);
          const values = yField ? categoryData.map((d) => d[yField]) : categoryData.map((d) => d.value || 0);

          const categoryY = (xScale as any)(category) + bandWidth / 2;

          return (
            <RidgeDensity
              key={`ridge-${category}-${idx}`}
              values={values}
              baselineY={categoryY}
              yScale={yScale}
              bandwidth={bandwidth}
              numPoints={numPoints}
              fill={fill || ctx.getColor(idx)}
              stroke={stroke || ctx.getColor(idx)}
              strokeWidth={strokeWidth}
              opacity={opacity}
              fillOpacity={fillOpacity}
              filled={filled}
              ridgeHeight={bandWidth * (1 + ridgeOverlap)}
            />
          );
        })}
      </g>
    );
  } else {
    // Standard density plot: continuous distribution
    const values = xField ? data.map((d) => d[xField]) : data.map((d) => d.value || 0);

    return (
      <StandardDensity
        values={values}
        xScale={xScale}
        yScale={yScale}
        bandwidth={bandwidth}
        numPoints={numPoints}
        fill={densityFill}
        stroke={densityStroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        fillOpacity={fillOpacity}
        filled={filled}
        label={label}
      />
    );
  }
}

interface StandardDensityProps {
  values: number[];
  xScale: any;
  yScale: any;
  bandwidth: number | 'auto';
  numPoints: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  fillOpacity: number;
  filled: boolean;
  label?: string;
}

function StandardDensity({
  values,
  xScale,
  yScale,
  bandwidth,
  numPoints,
  fill,
  stroke,
  strokeWidth,
  opacity,
  fillOpacity,
  filled,
  label
}: StandardDensityProps) {
  // Calculate KDE
  const bw = bandwidth === 'auto' ? silvermanBandwidth(values) : bandwidth;
  const densityData = kde(values, bw, numPoints);

  if (densityData.length === 0) return null;

  // Create path
  const pathPoints = densityData.map((d) => {
    const px = xScale(d.x);
    const py = yScale(d.y);
    return `${px},${py}`;
  });

  const pathD = `M ${pathPoints.join(' L ')}`;

  // For filled area, close the path
  let filledPathD = pathD;
  if (filled) {
    const lastPoint = densityData[densityData.length - 1];
    const firstPoint = densityData[0];
    const baselineY = yScale(0);
    filledPathD = `${pathD} L ${xScale(lastPoint.x)},${baselineY} L ${xScale(firstPoint.x)},${baselineY} Z`;
  }

  return (
    <g className="density-plot" data-label={label}>
      {filled && (
        <path
          d={filledPathD}
          fill={fill}
          opacity={fillOpacity}
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </g>
  );
}

interface RidgeDensityProps {
  values: number[];
  baselineY: number;
  yScale: any;
  bandwidth: number | 'auto';
  numPoints: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  fillOpacity: number;
  filled: boolean;
  ridgeHeight: number;
}

function RidgeDensity({
  values,
  baselineY,
  yScale,
  bandwidth,
  numPoints,
  fill,
  stroke,
  strokeWidth,
  opacity,
  fillOpacity,
  filled,
  ridgeHeight
}: RidgeDensityProps) {
  // Calculate KDE
  const bw = bandwidth === 'auto' ? silvermanBandwidth(values) : bandwidth;
  const densityData = kde(values, bw, numPoints);

  if (densityData.length === 0) return null;

  // Find max density for scaling
  const maxDensity = Math.max(...densityData.map((d) => d.y));

  // Create path (horizontal ridge orientation)
  // x-axis becomes the value being plotted
  // y-axis becomes the density (scaled to ridge height)
  const pathPoints = densityData.map((d) => {
    const px = yScale(d.x); // Value on x-axis (horizontal)
    const densityScaled = (d.y / maxDensity) * ridgeHeight;
    const py = baselineY - densityScaled; // Density extends upward
    return `${px},${py}`;
  });

  const pathD = `M ${pathPoints.join(' L ')}`;

  // For filled area, close the path at baseline
  let filledPathD = pathD;
  if (filled) {
    const firstPoint = densityData[0];
    const lastPoint = densityData[densityData.length - 1];
    filledPathD = `${pathD} L ${yScale(lastPoint.x)},${baselineY} L ${yScale(firstPoint.x)},${baselineY} Z`;
  }

  return (
    <g className="ridge-density">
      {filled && (
        <path
          d={filledPathD}
          fill={fill}
          opacity={fillOpacity}
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </g>
  );
}
