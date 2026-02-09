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

// Biology components
export { PhyloTree } from './series/PhyloTree';
export { SequenceLogo, generateSampleSequences } from './series/SequenceLogo';

// Chemistry components
export { Molecule, sampleMolecules } from './series/Molecule';
export { NMRSpectrum } from './series/NMRSpectrum';
export { IRSpectrum } from './series/IRSpectrum';
export { MassSpectrum } from './series/MassSpectrum';

// Utilities
export * from './utils/statistics';
export * from './utils/colorScales';
export * from './utils/biology';
export * from './utils/chemistry';

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
export type { PhyloTreeProps, TreeLayout } from './series/PhyloTree';
export type { SequenceLogoProps, SequenceType } from './series/SequenceLogo';
export type { PhyloNode } from './utils/biology';
export type { MoleculeProps } from './series/Molecule';
export type { NMRSpectrumProps } from './series/NMRSpectrum';
export type { IRSpectrumProps } from './series/IRSpectrum';
export type { MassSpectrumProps } from './series/MassSpectrum';
export type { NMRSpectrum as NMRSpectrumType, IRSpectrum as IRSpectrumType, MassSpectrum as MassSpectrumType, NMRPeak, IRPeak, MassPeak } from './utils/chemistry';
