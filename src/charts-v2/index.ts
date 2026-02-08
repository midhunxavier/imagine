/**
 * Charts v2 - Public API exports
 */

// Core components
export { Chart } from './Chart';
export { ChartProvider, useChartContext } from './ChartContext';

// Simple all-in-one charts
export { LineChart, ScatterPlot, BarChart, BoxPlotChart, ViolinPlotChart } from './SimpleCharts';

// Series components
export { LineSeries } from './series/LineSeries';
export { ScatterSeries } from './series/ScatterSeries';
export { BarSeries } from './series/BarSeries';
export { BoxPlot } from './series/BoxPlot';
export { ViolinPlot } from './series/ViolinPlot';

// Axes
export { XAxis, YAxis } from './axes/Axes';

// Decorations
export { Title } from './decorations/Title';

// Utilities
export * from './utils/statistics';

// Types
export type { ChartProps } from './Chart';
export type { ChartContextValue } from './ChartContext';
export type { LineSeriesProps, CurveType } from './series/LineSeries';
export type { ScatterSeriesProps } from './series/ScatterSeries';
export type { BarSeriesProps } from './series/BarSeries';
export type { BoxPlotProps } from './series/BoxPlot';
export type { ViolinPlotProps } from './series/ViolinPlot';
export type { AxisProps } from './axes/Axes';
export type { TitleProps } from './decorations/Title';
