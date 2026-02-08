/**
 * Simplified All-in-One Chart Components
 * 
 * These provide maximum simplicity - just pass data and go!
 */

import { Chart, type ChartProps } from './Chart';
import { LineSeries } from './series/LineSeries';
import { ScatterSeries } from './series/ScatterSeries';
import { BarSeries } from './series/BarSeries';
import { BoxPlot } from './series/BoxPlot';
import { ViolinPlot } from './series/ViolinPlot';
import { Heatmap, type HeatmapCell } from './series/Heatmap';
import { Histogram } from './series/Histogram';
import { DensityPlot } from './series/DensityPlot';
import { XAxis, YAxis } from './axes/Axes';
import { Title } from './decorations/Title';
import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import type { ColorScaleType } from './utils/colorScales';

/**
 * LineChart - Simple line chart with auto-inference
 * 
 * @example
 * // Simplest usage - auto-infers x and y from data
 * <LineChart data={timeSeries} width={600} height={400} />
 * 
 * @example
 * // Specify mappings
 * <LineChart data={data} x="time" y="temperature" width={600} height={400} />
 * 
 * @example
 * // Full customization
 * <LineChart 
 *   data={data}
 *   x="time"
 *   y="temperature"
 *   title="Temperature over Time"
 *   xLabel="Time (hours)"
 *   yLabel="Temperature (°C)"
 *   theme="nature"
 *   showGrid
 * />
 */
export function LineChart<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  showMarkers?: boolean;
  strokeWidth?: number;
}) {
  const { showMarkers, strokeWidth, showGrid = true, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis showGrid={showGrid === true || showGrid === 'x'} />
      <LineSeries strokeWidth={strokeWidth} />
      {showMarkers && <ScatterSeries />}
    </Chart>
  );
}

/**
 * ScatterPlot - Simple scatter plot with auto-inference
 */
export function ScatterPlot<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  size?: string | number;
  markerSize?: number;
}) {
  const { size, markerSize, showGrid = true, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis showGrid={showGrid === true || showGrid === 'x'} />
      <ScatterSeries size={size} r={markerSize} />
    </Chart>
  );
}

/**
 * BarChart - Simple bar chart with auto-inference
 */
export function BarChart<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  horizontal?: boolean;
  cornerRadius?: number;
}) {
  const { horizontal, cornerRadius, showGrid, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis showGrid={showGrid === true || showGrid === 'x'} />
      <BarSeries horizontal={horizontal} cornerRadius={cornerRadius} />
    </Chart>
  );
}

/**
 * BoxPlotChart - Statistical distribution visualization
 * 
 * @example
 * <BoxPlotChart
 *   data={data}
 *   x="group"
 *   y="values"
 *   showOutliers
 *   whiskerType="tukey"
 * />
 */
export function BoxPlotChart<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  showOutliers?: boolean;
  showNotch?: boolean;
  whiskerType?: 'tukey' | 'minmax';
  boxWidth?: number;
}) {
  const { showOutliers, showNotch, whiskerType, boxWidth, showGrid, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis />
      <BoxPlot
        showOutliers={showOutliers}
        showNotch={showNotch}
        whiskerType={whiskerType}
        boxWidth={boxWidth}
      />
    </Chart>
  );
}

/**
 * ViolinPlotChart - Distribution with density visualization
 * 
 * @example
 * <ViolinPlotChart
 *   data={data}
 *   x="group"
 *   y="values"
 *   showQuartiles
 *   showMedian
 * />
 */
export function ViolinPlotChart<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  showQuartiles?: boolean;
  showMedian?: boolean;
  bandwidth?: number | 'auto';
  violinWidth?: number;
}) {
  const { showQuartiles, showMedian, bandwidth, violinWidth, showGrid, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis />
      <ViolinPlot
        showQuartiles={showQuartiles}
        showMedian={showMedian}
        bandwidth={bandwidth}
        violinWidth={violinWidth}
      />
    </Chart>
  );
}


/**
 * HeatmapChart - 2D matrix visualization
 */
export function HeatmapChart(props: FigureComponentBaseProps & {
  data?: HeatmapCell[];
  matrix?: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  colorScale?: ColorScaleType | string[];
  domain?: [number, number] | 'auto';
  cellSize?: number;
  cellGap?: number;
  showValues?: boolean;
  valueFormat?: (value: number) => string;
  title?: string;
  subtitle?: string;
  theme?: any;
}) {
  const {
    data,
    matrix,
    rowLabels,
    colLabels,
    colorScale = 'viridis',
    domain = 'auto',
    cellSize = 30,
    cellGap = 2,
    showValues = false,
    valueFormat,
    title,
    subtitle,
    theme = 'default',
    ...figureProps
  } = props;

  return (
    <Figure {...figureProps} title={title}>
      <Chart
        data={data || []}
        width={figureProps.width}
        height={figureProps.height}
        theme={theme}
      >
        {title && <Title text={title} subtitle={subtitle} />}
        <Heatmap
          data={data}
          matrix={matrix}
          rowLabels={rowLabels}
          colLabels={colLabels}
          colorScale={colorScale}
          domain={domain}
          cellSize={cellSize}
          cellGap={cellGap}
          showValues={showValues}
          valueFormat={valueFormat}
        />
      </Chart>
    </Figure>
  );
}

/**
 * HistogramChart - Distribution visualization with binning
 * 
 * @example
 * // Simplest usage - auto-bins the data
 * <HistogramChart data={measurements} x="value" />
 * 
 * @example
 * // Custom binning with density overlay
 * <HistogramChart
 *   data={data}
 *   x="measurement"
 *   bins={20}
 *   showDensity
 *   normalize
 * />
 */
export function HistogramChart<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  bins?: number | number[] | 'auto' | 'sturges' | 'fd';
  normalize?: boolean;
  showDensity?: boolean;
  densityBandwidth?: number | 'auto';
  barGap?: number;
}) {
  const { bins, normalize, showDensity, densityBandwidth, barGap, showGrid, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis showGrid={showGrid === true || showGrid === 'x'} />
      <Histogram
        bins={bins}
        normalize={normalize}
        showDensity={showDensity}
        densityBandwidth={densityBandwidth}
        barGap={barGap}
      />
    </Chart>
  );
}

/**
 * DensityPlotChart - Kernel density estimation visualization
 * 
 * @example
 * // Simple density plot
 * <DensityPlotChart data={measurements} x="value" />
 * 
 * @example
 * // Ridge plot (grouped density plots)
 * <DensityPlotChart
 *   data={data}
 *   x="category"
 *   y="measurement"
 *   ridge
 *   bandwidth="auto"
 * />
 */
export function DensityPlotChart<T extends Record<string, any>>(props: Omit<ChartProps<T>, 'children'> & {
  bandwidth?: number | 'auto';
  numPoints?: number;
  filled?: boolean;
  ridge?: boolean;
  ridgeOverlap?: number;
}) {
  const { bandwidth, numPoints, filled, ridge, ridgeOverlap, showGrid, ...chartProps } = props;

  return (
    <Chart {...chartProps} showGrid={showGrid}>
      {props.title && <Title text={props.title} />}
      <YAxis showGrid={showGrid === true || showGrid === 'y'} />
      <XAxis showGrid={showGrid === true || showGrid === 'x'} />
      <DensityPlot
        bandwidth={bandwidth}
        numPoints={numPoints}
        filled={filled}
        ridge={ridge}
        ridgeOverlap={ridgeOverlap}
      />
    </Chart>
  );
}

