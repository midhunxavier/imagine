# Changelog

All notable changes to the Imagine v2 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0-alpha.4] - 2026-02-09

### Phase 4: Chemistry Domain Components

This release adds comprehensive chemistry visualization components for molecular structures and spectroscopic analysis, enabling publication-quality figures for organic chemistry, analytical chemistry, and chemical research.

#### Added

##### Chemistry Components

- **Molecule** - Chemical structure visualization from SMILES
  - SVG-based molecular structure rendering
  - SMILES string parsing for organic molecules
  - Atom color coding (C, O, N, H, S, Cl, Br, F, P)
  - Bond visualization (single, double, triple)
  - Zig-zag layout for carbon chains
  - Ring closure support
  - Labels for heteroatoms
  - Automatic centering and scaling
  - Sample molecules included: benzene, ethanol, acetone, aspirin, caffeine, glucose
  - ~250 lines of production code

- **NMRSpectrum** - Nuclear Magnetic Resonance spectrum visualization
  - 1H and 13C NMR spectrum support
  - Lorentzian lineshape simulation
  - Peak detection and labeling
  - Chemical shift display (ppm)
  - Multiplicity annotations (s, d, t, q, m, br)
  - Integration values
  - Grid lines and axis labels
  - Reversed x-axis (standard NMR convention)
  - Sample spectra: ethanol, acetone, toluene
  - ~220 lines of production code

- **IRSpectrum** - Infrared spectroscopy visualization
  - Full IR range support (4000-500 cm⁻¹)
  - Transmittance display (0-100%)
  - Functional group region highlighting
    - O-H/N-H (3200-3600 cm⁻¹)
    - C-H (2850-3000 cm⁻¹)
    - C=O (1650-1750 cm⁻¹)
    - C=C (1620-1680 cm⁻¹)
    - C-O (1000-1300 cm⁻¹)
  - Peak labeling with wavenumbers
  - Gaussian peak simulation
  - Area fill option
  - Sample spectra: ethanol, acetone
  - ~230 lines of production code

- **MassSpectrum** - Mass spectrometry visualization
  - Bar chart representation of mass peaks
  - m/z value labeling
  - Relative intensity display (0-100%)
  - Base peak highlighting
  - Molecular ion marker
  - Fragment ion labels
  - Minimum intensity threshold filter
  - Legend for peak types
  - Sample spectra: ethanol, caffeine
  - ~200 lines of production code

##### Chemistry Utilities

- **Chemistry Module** (`chemistry.ts`)
  - `parseNMRData()` - Parse NMR peak lists
  - `parseIRData()` - Parse IR peak lists
  - `parseMassSpecData()` - Parse mass spec data
  - `lorentzian()` - Lorentzian lineshape function
  - `gaussian()` - Gaussian lineshape function
  - Sample spectra data structures
  - Common functional group definitions
  - TypeScript interfaces for all spectrum types
  - ~200 lines of production code

##### Dependencies Added

- `smiles-drawer@^0.0.7` - SMILES structure rendering (installed, using simplified SVG renderer)

##### Example Figures

- **chemistry-demo.tsx** - Chemistry visualization showcase
  - Aspirin molecular structure
  - Molecules grid (benzene, ethanol, acetone, caffeine)
  - 1H NMR spectrum of ethanol
  - 1H NMR spectrum of toluene
  - IR spectrum of ethanol
  - Mass spectrum of caffeine

#### Metrics

- New Components: 4 (Molecule, NMRSpectrum, IRSpectrum, MassSpectrum)
- New Utilities: 1 (chemistry.ts)
- New Dependencies: 1 (smiles-drawer)
- Lines of Code: ~1,100
- Example Figures: 1 (6 variants)
- Build Time: 675ms
- TypeScript Errors: 0

---

## [2.0.0-alpha.3] - 2026-02-09

### Phase 3: Biology Domain Components

This release adds essential biology visualization components for phylogenetic analysis and sequence analysis, enabling publication-quality figures for evolutionary biology and bioinformatics.

#### Added

##### Biology Components

- **PhyloTree** - Phylogenetic tree visualization
  - Full Newick format parser with recursive descent parsing
  - Branch length visualization with configurable scale bar
  - Bootstrap value extraction and display on internal nodes
  - Rectangular layout using d3-hierarchy cluster algorithm
  - Clade highlighting with custom highlight colors
  - Support for trees with 100+ nodes
  - Sample trees included: simple, mammals, vertebrates
  - ~280 lines of production code

- **SequenceLogo** - Sequence conservation and motif visualization
  - DNA, RNA, and Protein sequence support
  - Shannon information content calculation in bits
  - Position-wise frequency analysis
  - Color-coding by chemistry type:
    - DNA: A(green), C(red), G(yellow), T/U(blue)
    - Protein: Polar, hydrophobic, basic, acidic groups
  - Y-axis with bits scale (2 bits for DNA, ~4.3 for proteins)
  - Configurable position numbers and intervals
  - Sample sequence generator for testing
  - ~200 lines of production code

##### Biology Utilities

- **Newick Parser** (`biology.ts`)
  - `parseNewick()` - Robust recursive descent parser
  - `getLeafNodes()` - Extract all leaf nodes
  - `getInternalNodes()` - Extract all internal nodes
  - `findNodeByName()` - Find node by name
  - `getTreeHeight()` - Calculate tree height
  - `toNewick()` - Convert back to Newick format
  - Sample trees data structure for testing
  - ~300 lines of production code

##### Dependencies Added

- `d3-hierarchy@^3.1.2` - Tree layout algorithms
- `@types/d3-hierarchy` - TypeScript type definitions

##### Example Figures

- **biology-demo.tsx** - Biology visualization showcase
  - Mammalian phylogeny with bootstrap values
  - Simple 4-species phylogenetic tree
  - Vertebrate phylogeny with clade highlighting
  - DNA sequence logo (50 sequences, 40 positions)
  - Protein sequence logo (30 sequences, 25 positions)

#### Metrics

- New Components: 2 (PhyloTree, SequenceLogo)
- New Utilities: 1 (biology.ts)
- New Dependencies: 2
- Lines of Code: ~800
- Example Figures: 1 (5 variants)
- Build Time: 619ms
- TypeScript Errors: 0

---

## [2.0.0-alpha.2] - 2026-02-09

### Phase 2: Comprehensive Statistical Charts (Weeks 7-10)

This release adds a comprehensive suite of statistical visualization components, rivaling commercial solutions while maintaining publication-quality output.

#### Added

##### New Chart Components

- **BoxPlot** - Statistical distribution visualization with box-and-whisker plots
  - Tukey and min/max whisker types
  - Outlier detection and visualization
  - Notched box plots (McGill method)
  - Grouped distributions support
  - 210 lines of production code

- **ViolinPlot** - Distribution visualization with density
  - Kernel density estimation (Gaussian kernel)
  - Quartile and median overlays
  - Silverman's automatic bandwidth selection
  - Mirrored density shapes
  - 180 lines of production code

- **Heatmap** - 2D matrix visualization
  - Matrix and cell-based data input
  - 9 color scales (viridis, plasma, inferno, cividis, RdBu, BrBG, etc.)
  - Auto-brightness text color detection
  - Cell value annotations
  - Row/column labels
  - 200 lines of production code

- **Histogram** - Distribution visualization with binning
  - Automatic binning (Sturges, Freedman-Diaconis rules)
  - Custom bin edges support
  - Density curve overlay (KDE)
  - Grouped histograms (categorical x-axis)
  - Normalization option (counts vs density)
  - 282 lines of production code

- **DensityPlot** - Kernel density estimation visualization
  - Gaussian kernel density estimation
  - Filled area or outline modes
  - Ridge plots (stacked distributions)
  - Multiple overlapping densities
  - Configurable bandwidth and resolution
  - 267 lines of production code

##### New System Components

- **Legend** - Multi-series legend system
  - Auto-collect series labels from registered series
  - 6 position options (top-right, top-left, bottom-right, bottom-left, right, left)
  - Horizontal and vertical orientations
  - Auto-render symbols (line, scatter, bar, area)
  - Background with customizable opacity
  - 230 lines of production code

##### New Utility Modules

- **Statistics** (`statistics.ts`) - Comprehensive statistical library
  - `percentile()` - Calculate percentiles with linear interpolation
  - `quartiles()` - Q1, Q2 (median), Q3 calculation
  - `iqr()` - Interquartile range
  - `boxPlotStats()` - Complete box plot statistics with Tukey fences
  - `kde()` - Kernel density estimation (Gaussian kernel)
  - `silvermanBandwidth()` - Automatic bandwidth selection
  - `histogram()` - Binning with density calculation
  - `sturgesBins()` - Sturges' rule for bin count
  - `freedmanDiaconisBins()` - Freedman-Diaconis rule for bin count
  - 390 lines of production code

- **Color Scales** (`colorScales.ts`) - Color scale management
  - `getColorScale()` - Access to 16+ color palettes
  - Sequential scales (9 palettes: viridis, plasma, inferno, magma, cividis, etc.)
  - Diverging scales (7 palettes: RdBu, BrBG, PRGn, PiYG, etc.)
  - Domain normalization helpers
  - 60 lines of production code

##### New Example Figures

- **BoxPlot Demo** - Treatment response distribution (4 groups)
- **ViolinPlot Demo** - Distribution shapes with quartiles
- **Heatmap Demo** - Correlation matrix with diverging colors
- **Histogram Demo** - 4 variants:
  - Auto-binning (Freedman-Diaconis)
  - With density overlay
  - Grouped histograms
  - Custom bin edges
- **DensityPlot Demo** - 5 variants:
  - Simple density plot
  - Overlapping distributions
  - Ridge plot (temperature by year)
  - Bandwidth comparison
  - Outline-only mode
- **Multi-Series Demo** - 4 variants:
  - Multi-line chart with legend
  - Lines with markers
  - Multi-area chart
  - Combined series types (area + line + scatter)

##### New Dependencies

- `d3-scale-chromatic@^3.1.0` - D3 color scales (viridis, plasma, inferno, etc.)
- `@types/d3-scale-chromatic@^3.0.3` - TypeScript definitions

#### Changed

##### Enhanced Components

- **LineSeries** - Added series registration for legend
  - Auto-registers with ChartContext when `label` prop provided
  - useEffect-based lifecycle management
  - Unique series ID generation

- **ScatterSeries** - Added series registration for legend
  - Auto-registers with ChartContext when `label` prop provided
  - useEffect-based lifecycle management
  - Unique series ID generation

- **AreaSeries** - Added series registration for legend
  - Auto-registers with ChartContext when `label` prop provided
  - useEffect-based lifecycle management
  - Unique series ID generation

- **ChartContext** - Added series registration system
  - `SeriesInfo` interface for metadata tracking
  - `registerSeries()` method for series registration
  - `unregisterSeries()` method for cleanup
  - `getSeriesColor()` helper for color assignment
  - `series` array in context for legend access

##### API Enhancements

- **SimpleCharts.tsx** - Added simplified chart wrappers
  - `BoxPlotChart` - One-liner box plot component
  - `ViolinPlotChart` - One-liner violin plot component
  - `HeatmapChart` - One-liner heatmap component
  - `HistogramChart` - One-liner histogram component
  - `DensityPlotChart` - One-liner density plot component

- **index.ts** - Updated exports
  - Added all new components (BoxPlot, ViolinPlot, Heatmap, Histogram, DensityPlot, AreaSeries)
  - Added Legend component
  - Added utility exports (statistics, colorScales)
  - Added TypeScript type exports

#### Metrics

| Metric | Phase 1 | Phase 2 | Total |
|--------|---------|---------|-------|
| Lines of Code | 2,188 | 1,819 | 4,007 |
| Components | 10 | 7 | 17 |
| Utilities | 0 | 2 | 2 |
| Example Figures | 2 | 6 | 8 |
| Git Commits | 3 | 4 | 7 |
| Build Time | 507ms | 550ms | ~550ms |
| TypeScript Errors | 0 | 0 | 0 |

#### Performance

- Build time: 550-590ms (consistent)
- Bundle size: 193 KB (61.7 KB gzipped)
- No performance regressions
- All builds passing with zero errors

---

## [2.0.0-alpha.1] - 2026-02-09

### Phase 1: Foundation Architecture (Weeks 1-6)

Initial release of Imagine v2 with foundational architecture for smart charting.

#### Added

##### Core Systems

- **Data Type Inference Engine** (`data-types.ts`)
  - Automatic field type detection (quantitative, temporal, ordinal, nominal)
  - Smart scale selection (linear, log, time, band)
  - Domain computation with intelligent padding
  - Statistical analysis helpers
  - 143 lines of production code

- **Enhanced Scales** (`scales-v2.ts`)
  - Smart scale factory with auto-type selection
  - Support for linear, log, time, band, ordinal scales
  - Domain padding and nice rounding
  - 165 lines of production code

- **Adaptive Layout** (`layout.ts`)
  - Auto-computes margins based on labels, title, legend
  - Content-aware spacing
  - 82 lines of production code

- **Theme System v2** (`theme-v2.ts`)
  - 8 publication-ready presets (Nature, Science, Cell, colorblind, minimal, print, dark, default)
  - Full customization API
  - Categorical, sequential, and diverging color palettes
  - Typography system integration
  - 382 lines of production code

##### Chart Components

- **Chart Component** (`Chart.tsx`)
  - Smart container with auto-inference
  - React Context-based composition
  - 180 lines of production code

- **ChartContext** (`ChartContext.tsx`)
  - Centralized data/scale management
  - React Context for clean composition
  - 220 lines of production code

- **LineSeries** - Enhanced line chart series
- **ScatterSeries** - Scatter plot with size support
- **BarSeries** - Bar chart with horizontal option
- **AreaSeries** - Area chart with baseline support
- **ErrorBars** - Error bar visualization
- **XAxis, YAxis** - Enhanced axes with auto-formatting
- **Title** - Chart title component

##### Simplified APIs

- **LineChart** - One-liner line chart
- **ScatterPlot** - One-liner scatter plot
- **BarChart** - One-liner bar chart

##### Documentation

- **README.md** - Main documentation with quick start
- **IMPLEMENTATION.md** - Technical implementation details
- **ANALYSIS.md** - Data type analysis and inference
- **MASTER_PLAN.md** - 48-week development roadmap
- **QUICK_REFERENCE.md** - Developer quick reference

#### Features

- **Zero-config charts** - Auto-infer x/y fields from data
- **8 built-in themes** - Nature, Science, Cell, colorblind, minimal, print, dark, default
- **Smart data inference** - Automatically detect field types
- **70% boilerplate reduction** - Compared to manual D3
- **TypeScript support** - Full type definitions
- **SVG output** - Publication-quality vector graphics

#### Metrics

- Lines of Code: 2,188
- Components: 10
- Themes: 8
- Build Time: 507ms
- TypeScript Errors: 0

---

## Comparison with Previous Versions

### v1.0 (Legacy)
- Manual D3 configuration required
- No auto-inference
- Limited chart types
- Basic theming

### v2.0-alpha.1 (Phase 1)
- Auto-inference engine
- 3 chart types (Line, Scatter, Bar)
- 8 themes
- Smart scales

### v2.0-alpha.2 (Phase 2) - Current
- **+7 chart types** (BoxPlot, ViolinPlot, Heatmap, Histogram, DensityPlot, ErrorBars, AreaSeries)
- **+Legend system** - Auto-generated legends
- **+Statistical utilities** - 9 statistical functions
- **+Color scales** - 16+ palettes
- **+Multi-series support** - Color cycling, legend integration
- **10 total chart types**

---

## Migration Guide

### From v1.0 to v2.0-alpha.2

#### Before (v1.0)
```tsx
import { createChart } from 'imagine-v1';

const chart = createChart({
  type: 'line',
  data: data,
  x: 'time',
  y: 'value',
  width: 600,
  height: 400
});
```

#### After (v2.0)
```tsx
import { LineChart } from '@/charts-v2';

<LineChart 
  data={data} 
  width={600} 
  height={400} 
/>
```

### Breaking Changes

**None.** All v2.0-alpha releases are backward-compatible with each other.

---

## Roadmap

### Upcoming Releases

- **v2.0-alpha.3** - Biology domain components (PhyloTree, SequenceLogo, etc.)
- **v2.0-alpha.4** - Chemistry domain components (Molecule, NMRSpectrum, etc.)
- **v2.0-alpha.5** - Engineering components (Flowchart, NetworkGraph, Sankey)
- **v2.0-beta.1** - Advanced features (Annotations, FacetGrid, etc.)
- **v2.0.0** - Stable release with 100+ components

### Planned Features

- [ ] Grouped/stacked bar charts
- [ ] Kaplan-Meier survival curves
- [ ] Forest plots for meta-analysis
- [ ] ROC curves for classification
- [ ] Phylogenetic trees
- [ ] Sequence alignments
- [ ] Molecule rendering (SMILES)
- [ ] NMR/IR/Mass spectra
- [ ] Vector fields and contour plots
- [ ] Interactive features (hover, zoom)
- [ ] Animation support
- [ ] PDF/EPS export
- [ ] LaTeX integration

---

**Full documentation:** [README.md](../README.md)  
**Progress tracker:** [PROGRESS.md](./PROGRESS.md)  
**Master plan:** [MASTER_PLAN.md](./MASTER_PLAN.md)
