/**
 * Histogram Component - Distribution visualization with binning
 */

import { useChartContext } from '../ChartContext';
import { histogram, sturgesBins, freedmanDiaconisBins, kde, silvermanBandwidth } from '../utils/statistics';

export interface HistogramProps {
  // Data field mappings
  x?: string; // Value field for binning (or category field for grouped histograms)
  y?: string; // Value field (when x is categorical)

  // Binning configuration
  bins?: number | number[] | 'auto' | 'sturges' | 'fd'; // Number of bins, bin edges, or binning method
  
  // Appearance
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  barGap?: number; // Gap between bars as fraction of bar width (default 0)

  // Features
  normalize?: boolean; // Show density instead of counts
  showDensity?: boolean; // Overlay KDE curve
  densityBandwidth?: number | 'auto'; // Bandwidth for KDE (auto uses Silverman's rule)
  densityColor?: string;
  densityStrokeWidth?: number;

  // Label for legend
  label?: string;

  // Data override
  data?: any[];
}

export function Histogram({
  x: xProp,
  y: yProp,
  bins = 'auto',
  fill,
  stroke,
  strokeWidth = 1,
  opacity = 0.7,
  barGap = 0,
  normalize = false,
  showDensity = false,
  densityBandwidth = 'auto',
  densityColor,
  densityStrokeWidth = 2,
  label,
  data: dataProp
}: HistogramProps) {
  const ctx = useChartContext();

  const data = dataProp || ctx.data;
  const xField = xProp || ctx.xField;
  const yField = yProp || ctx.yField;

  if (!data || data.length === 0) return null;

  const theme = ctx.theme;
  const xScale = ctx.xScale;
  const yScale = ctx.yScale;

  if (!xScale || !yScale) {
    console.warn('Histogram: scales not available');
    return null;
  }

  // Determine colors
  const barFill = fill || ctx.getColor(0);
  const barStroke = stroke || theme.colors.foreground;
  const densityCurveColor = densityColor || ctx.getColor(1);

  // Check if we have grouped histograms (categorical x-axis)
  const xType = (xScale as any).bandwidth ? 'categorical' : 'quantitative';

  if (xType === 'categorical') {
    // Grouped histograms: one histogram per category
    const categories = Array.from(new Set(data.map((d) => d[xField!])));

    return (
      <g className="histogram-group">
        {categories.map((category, idx) => {
          const categoryData = data.filter((d) => d[xField!] === category);
          const values = yField ? categoryData.map((d) => d[yField]) : categoryData.map((d) => d[xField!]);

          return (
            <HistogramBars
              key={`histogram-${category}-${idx}`}
              values={values}
              xPosition={(xScale as any)(category)}
              bandWidth={(xScale as any).bandwidth?.() || 0}
              yScale={yScale}
              bins={bins}
              normalize={normalize}
              fill={barFill}
              stroke={barStroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
              barGap={barGap}
              showDensity={showDensity}
              densityBandwidth={densityBandwidth}
              densityColor={densityCurveColor}
              densityStrokeWidth={densityStrokeWidth}
            />
          );
        })}
      </g>
    );
  } else {
    // Single histogram: x-axis is the value being binned
    const values = xField ? data.map((d) => d[xField]) : data.map((d) => d.value || 0);

    return (
      <HistogramBars
        values={values}
        xPosition={0}
        bandWidth={0}
        yScale={yScale}
        xScale={xScale}
        bins={bins}
        normalize={normalize}
        fill={barFill}
        stroke={barStroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        barGap={barGap}
        showDensity={showDensity}
        densityBandwidth={densityBandwidth}
        densityColor={densityCurveColor}
        densityStrokeWidth={densityStrokeWidth}
      />
    );
  }
}

interface HistogramBarsProps {
  values: number[];
  xPosition: number;
  bandWidth: number;
  yScale: any;
  xScale?: any;
  bins: number | number[] | 'auto' | 'sturges' | 'fd';
  normalize: boolean;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  barGap: number;
  showDensity: boolean;
  densityBandwidth: number | 'auto';
  densityColor: string;
  densityStrokeWidth: number;
}

function HistogramBars({
  values,
  xPosition,
  bandWidth,
  yScale,
  xScale,
  bins,
  normalize,
  fill,
  stroke,
  strokeWidth,
  opacity,
  barGap,
  showDensity,
  densityBandwidth,
  densityColor,
  densityStrokeWidth
}: HistogramBarsProps) {
  // Determine number of bins
  let numBins: number | number[];
  if (bins === 'auto' || bins === 'fd') {
    numBins = freedmanDiaconisBins(values);
  } else if (bins === 'sturges') {
    numBins = sturgesBins(values);
  } else {
    numBins = bins;
  }

  // Compute histogram
  const histData = histogram(values, numBins);

  if (histData.length === 0) return null;

  // Determine bar positions and dimensions
  const isGrouped = bandWidth > 0;
  const plotHeight = yScale(0) - yScale(yScale.domain()[1]);

  const bars = histData.map((bin) => {
    const value = normalize ? bin.density : bin.count;
    const height = yScale(0) - yScale(value);

    let x: number;
    let width: number;

    if (isGrouped) {
      // Grouped histogram: use band width
      const binWidth = bandWidth / histData.length;
      const binIndex = histData.indexOf(bin);
      x = xPosition + binIndex * binWidth;
      width = binWidth * (1 - barGap);
    } else {
      // Single histogram: use x-scale
      x = xScale(bin.x0);
      width = xScale(bin.x1) - xScale(bin.x0);
      width *= (1 - barGap);
    }

    const y = yScale(value);

    return { x, y, width, height, bin };
  });

  // Compute KDE if requested
  let densityCurve: Array<{ x: number; y: number }> | null = null;
  if (showDensity && !isGrouped) {
    const bandwidth = densityBandwidth === 'auto' 
      ? silvermanBandwidth(values)
      : densityBandwidth;
    
    const kdeData = kde(values, bandwidth, 100);
    
    // Scale KDE to match histogram scale
    if (normalize) {
      densityCurve = kdeData;
    } else {
      // Scale density to counts
      const binWidth = histData[0].x1 - histData[0].x0;
      const scaleFactor = values.length * binWidth;
      densityCurve = kdeData.map(d => ({ x: d.x, y: d.y * scaleFactor }));
    }
  }

  return (
    <>
      {/* Bars */}
      {bars.map((bar, idx) => (
        <rect
          key={`bar-${idx}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      ))}

      {/* Density curve overlay */}
      {densityCurve && xScale && (
        <path
          d={densityCurve.map((d, i) => {
            const px = xScale(d.x);
            const py = yScale(d.y);
            return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
          }).join(' ')}
          fill="none"
          stroke={densityColor}
          strokeWidth={densityStrokeWidth}
        />
      )}
    </>
  );
}
