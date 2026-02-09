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
export { SignificanceBracket } from './decorations/SignificanceBracket';
export { ScaleBar } from './decorations/ScaleBar';
export { DataAnnotation } from './decorations/DataAnnotation';
export { HighlightRegion } from './decorations/HighlightRegion';

// Biology components
export { PhyloTree } from './series/PhyloTree';
export { SequenceLogo, generateSampleSequences } from './series/SequenceLogo';

// Chemistry components
export { Molecule, sampleMolecules } from './series/Molecule';
export { NMRSpectrum } from './series/NMRSpectrum';
export { IRSpectrum } from './series/IRSpectrum';
export { MassSpectrum } from './series/MassSpectrum';

// Engineering components
export { Flowchart } from './series/Flowchart';
export { NetworkGraph } from './series/NetworkGraph';
export { SankeyDiagram } from './series/SankeyDiagram';
export { SystemDiagram } from './series/SystemDiagram';

// Physics/Mathematics components
export { VectorField } from './series/VectorField';
export { ParametricPlot } from './series/ParametricPlot';
export { PolarPlot } from './series/PolarPlot';
export { ContourPlot } from './series/ContourPlot';
export { PhaseDiagram } from './series/PhaseDiagram';

// Utilities
export * from './utils/statistics';
export * from './utils/colorScales';
export * from './utils/biology';
export * from './utils/chemistry';
export * from './utils/engineering';
export * from './utils/physics';

// Export & Integration
export { ResponsiveChart } from './core/ResponsiveChart';
export { useChartExport } from './hooks/useChartExport';
export { ExportControls } from './components/ExportControls';
export { CanvasScatterSeries } from './series/CanvasScatterSeries';

// Types
export type { ChartProps } from './Chart';
export type { ChartContextValue } from './ChartContext';
export type { ResponsiveChartProps } from './core/ResponsiveChart';
export type { ExportControlsProps } from './components/ExportControls';
export type { CanvasScatterSeriesProps } from './series/CanvasScatterSeries';
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
export type { SignificanceBracketProps } from './decorations/SignificanceBracket';
export type { ScaleBarProps } from './decorations/ScaleBar';
export type { DataAnnotationProps } from './decorations/DataAnnotation';
export type { HighlightRegionProps } from './decorations/HighlightRegion';
export type { SeriesInfo } from './ChartContext';
export type { PhyloTreeProps, TreeLayout } from './series/PhyloTree';
export type { SequenceLogoProps, SequenceType } from './series/SequenceLogo';
export type { PhyloNode } from './utils/biology';
export type { MoleculeProps } from './series/Molecule';
export type { NMRSpectrumProps } from './series/NMRSpectrum';
export type { IRSpectrumProps } from './series/IRSpectrum';
export type { MassSpectrumProps } from './series/MassSpectrum';
export type { NMRSpectrum as NMRSpectrumType, IRSpectrum as IRSpectrumType, MassSpectrum as MassSpectrumType, NMRPeak, IRPeak, MassPeak } from './utils/chemistry';
export type { FlowchartProps } from './series/Flowchart';
export type { NetworkGraphProps } from './series/NetworkGraph';
export type { SankeyDiagramProps } from './series/SankeyDiagram';
export type { SystemDiagramProps } from './series/SystemDiagram';
export type { FlowNode, FlowEdge, NetworkNode, NetworkEdge, SankeyNode, SankeyLink, SystemBlock } from './utils/engineering';

// Physics/Mathematics types
export type { VectorFieldProps } from './series/VectorField';
export type { ParametricPlotProps } from './series/ParametricPlot';
export type { PolarPlotProps } from './series/PolarPlot';
export type { ContourPlotProps } from './series/ContourPlot';
export type { PhaseDiagramProps } from './series/PhaseDiagram';
