/**
 * Charts v2 - Public API exports
 */

// Core components
export { Chart } from './Chart';
export { ChartProvider, useChartContext } from './ChartContext';

// Simple all-in-one charts
export { LineChart, ScatterPlot, BarChart, BoxPlotChart, ViolinPlotChart, HeatmapChart, HistogramChart, DensityPlotChart } from './SimpleCharts';

// Series components
export { LineSeries } from './series/LineSeries';
export { ScatterSeries } from './series/ScatterSeries';
export { BarSeries } from './series/BarSeries';
export { AreaSeries } from './series/AreaSeries';
export { BoxPlot } from './series/BoxPlot';
export { ViolinPlot } from './series/ViolinPlot';
export { Heatmap } from './series/Heatmap';
export type { HeatmapCell } from './series/Heatmap';
export { Histogram } from './series/Histogram';
export { DensityPlot } from './series/DensityPlot';

// Axes
export { XAxis, YAxis } from './axes/Axes';

// Decorations
export { Title } from './decorations/Title';
export { Legend } from './decorations/Legend';

// Utilities
export * from './utils/statistics';
export * from './utils/colorScales';

// Types
export type { ChartProps } from './Chart';
export type { ChartContextValue } from './ChartContext';
export type { LineSeriesProps, CurveType } from './series/LineSeries';
export type { ScatterSeriesProps } from './series/ScatterSeries';
export type { BarSeriesProps } from './series/BarSeries';
export type { AreaSeriesProps } from './series/AreaSeries';
export type { BoxPlotProps } from './series/BoxPlot';
export type { ViolinPlotProps } from './series/ViolinPlot';
export type { HistogramProps } from './series/Histogram';
export type { DensityPlotProps } from './series/DensityPlot';
export type { AxisProps } from './axes/Axes';
export type { TitleProps } from './decorations/Title';
export type { LegendProps } from './decorations/Legend';
export type { SeriesInfo } from './ChartContext';
