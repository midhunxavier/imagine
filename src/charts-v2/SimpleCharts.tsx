/**
 * Simplified All-in-One Chart Components
 * 
 * These provide maximum simplicity - just pass data and go!
 */

import { Chart, type ChartProps } from './Chart';
import { LineSeries } from './series/LineSeries';
import { ScatterSeries } from './series/ScatterSeries';
import { BarSeries } from './series/BarSeries';
import { XAxis, YAxis } from './axes/Axes';
import { Title } from './decorations/Title';

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
