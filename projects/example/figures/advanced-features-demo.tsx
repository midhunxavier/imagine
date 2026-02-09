/**
 * Advanced Features Demo
 * Phase 7 showcase - Annotations, highlights, significance brackets, scale bars
 */
import React from 'react';
import {
  Chart, ChartProvider,
  XAxis, YAxis,
  BarSeries, LineSeries, ScatterSeries,
  SignificanceBracket, ScaleBar, DataAnnotation, HighlightRegion
} from '../../../src/charts-v2';

// Variant 1: Box plot with significance brackets
export const SignificanceBracketsDemo = () => {
  const groupA = [4.2, 4.5, 4.8, 5.1, 5.3];
  const groupB = [6.1, 6.4, 6.7, 7.0, 7.2];
  const groupC = [5.5, 5.8, 6.0, 6.2, 6.5];
  
  const barData = [
    { group: 'A', value: 4.8 },
    { group: 'B', value: 6.7 },
    { group: 'C', value: 6.0 }
  ];
  
  return (
    <ChartProvider data={barData} width={600} height={400}>
      <Chart data={barData} width={600} height={400}>
        <XAxis label="Treatment Group" />
        <YAxis label="Response (units)" />
        <BarSeries x="group" y="value" fill="#3498db" />
        
        {/* Significance brackets */}
        <SignificanceBracket x1="A" x2="B" y={7.5} label="***" barHeight={15} />
        <SignificanceBracket x1="B" x2="C" y={7.0} label="*" barHeight={10} />
        <SignificanceBracket x1="A" x2="C" y={6.5} label="**" barHeight={10} />
      </Chart>
    </ChartProvider>
  );
};

// Variant 2: Time series with highlighted regions
export const HighlightedRegionsDemo = () => {
  const data = Array.from({ length: 50 }, (_, i) => ({
    time: i,
    value: 10 + 5 * Math.sin(i / 5) + Math.random() * 2
  }));
  
  return (
    <ChartProvider data={data} width={700} height={400}>
      <Chart data={data} width={700} height={400}>
        <XAxis label="Time (days)" />
        <YAxis label="Measurement" />
        
        {/* Highlighted regions */}
        <HighlightRegion
          xStart={10}
          xEnd={20}
          fill="#FFD700"
          opacity={0.2}
          label="Event A"
          labelPosition="top"
        />
        <HighlightRegion
          xStart={30}
          xEnd={40}
          fill="#FF6B6B"
          opacity={0.2}
          label="Event B"
          labelPosition="top"
        />
        
        <LineSeries x="time" y="value" stroke="#2196F3" />
      </Chart>
    </ChartProvider>
  );
};

// Variant 3: Scatter plot with data annotations
export const DataAnnotationsDemo = () => {
  const data = [
    { x: 1, y: 2.3, label: 'Control' },
    { x: 2, y: 4.1, label: null },
    { x: 3, y: 3.8, label: null },
    { x: 4, y: 7.2, label: 'Peak Response' },
    { x: 5, y: 6.5, label: null },
    { x: 6, y: 5.9, label: null },
    { x: 7, y: 4.3, label: 'Recovery' },
    { x: 8, y: 3.1, label: null }
  ];
  
  return (
    <ChartProvider data={data} width={600} height={400}>
      <Chart data={data} width={600} height={400}>
        <XAxis label="Time Point" />
        <YAxis label="Response" />
        <ScatterSeries x="x" y="y" fill="#E74C3C" size={6} />
        <LineSeries x="x" y="y" stroke="#95A5A6" strokeWidth={1.5} />
        
        {/* Annotations for specific points */}
        <DataAnnotation
          x={1}
          y={2.3}
          label="Baseline"
          position="bottom-right"
          offset={40}
          pointColor="#E74C3C"
        />
        <DataAnnotation
          x={4}
          y={7.2}
          label="Peak Response"
          position="top"
          offset={35}
          pointColor="#E74C3C"
        />
        <DataAnnotation
          x={7}
          y={4.3}
          label="Recovery Phase"
          position="right"
          offset={45}
          pointColor="#E74C3C"
        />
      </Chart>
    </ChartProvider>
  );
};

// Variant 4: Microscopy image with scale bar
export const ScaleBarDemo = () => {
  const gridData = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: 10 + 3 * Math.sin(i / 2)
  }));
  
  return (
    <ChartProvider data={gridData} width={600} height={400}>
      <Chart data={gridData} width={600} height={400}>
        <XAxis label="Position (μm)" />
        <YAxis label="Intensity (a.u.)" />
        <LineSeries x="x" y="y" stroke="#9B59B6" />
        
        {/* Scale bar positioned at bottom-right */}
        <g transform={`translate(${500}, ${350})`}>
          <ScaleBar
            length={5}
            unit="μm"
            position="bottom-right"
            pixelsPerUnit={20}
            color="#333"
            fontSize={10}
          />
        </g>
      </Chart>
    </ChartProvider>
  );
};

// Variant 5: Combined features dashboard
export const CombinedFeaturesDemo = () => {
  const data = [
    { category: 'Control', mean: 12.5, sem: 1.2 },
    { category: 'Treatment A', mean: 18.3, sem: 1.5 },
    { category: 'Treatment B', mean: 22.1, sem: 1.8 },
    { category: 'Treatment C', mean: 19.7, sem: 1.4 }
  ];
  
  return (
    <ChartProvider data={data} width={700} height={450}>
      <Chart data={data} width={700} height={450}>
        <XAxis label="Experimental Condition" />
        <YAxis label="Activity Level (units)" />
        
        {/* Highlight normal range */}
        <HighlightRegion
          yStart={10}
          yEnd={15}
          direction="horizontal"
          fill="#E8F5E9"
          opacity={0.5}
          label="Normal Range"
          labelPosition="center"
          stroke="#4CAF50"
          strokeWidth={1}
          strokeDasharray="4,4"
        />
        
        <BarSeries x="category" y="mean" fill="#2196F3" />
        
        {/* Significance comparisons */}
        <SignificanceBracket x1="Control" x2="Treatment A" y={24} label="**" />
        <SignificanceBracket x1="Control" x2="Treatment B" y={27} label="***" />
        <SignificanceBracket x1="Treatment A" x2="Treatment B" y={25} label="*" />
        
        {/* Annotate the highest value */}
        <DataAnnotation
          x="Treatment B"
          y={22.1}
          label="Maximum Effect"
          position="top"
          offset={40}
          showPoint
        />
      </Chart>
    </ChartProvider>
  );
};

// Variant 6: Range highlighting with multiple regions
export const MultiRegionDemo = () => {
  const timeData = Array.from({ length: 100 }, (_, i) => ({
    time: i / 10,
    signal: 50 + 20 * Math.sin(i / 10) + 10 * Math.cos(i / 5)
  }));
  
  return (
    <ChartProvider data={timeData} width={800} height={400}>
      <Chart data={timeData} width={800} height={400}>
        <XAxis label="Time (s)" />
        <YAxis label="Signal Amplitude" />
        
        {/* Multiple highlighted phases */}
        <HighlightRegion
          xStart={0}
          xEnd={2}
          fill="#BBDEFB"
          opacity={0.3}
          label="Baseline"
          direction="vertical"
        />
        <HighlightRegion
          xStart={2}
          xEnd={5}
          fill="#FFE082"
          opacity={0.3}
          label="Stimulus"
          direction="vertical"
        />
        <HighlightRegion
          xStart={5}
          xEnd={7}
          fill="#C8E6C9"
          opacity={0.3}
          label="Response"
          direction="vertical"
        />
        <HighlightRegion
          xStart={7}
          xEnd={10}
          fill="#F8BBD0"
          opacity={0.3}
          label="Recovery"
          direction="vertical"
        />
        
        <LineSeries x="time" y="signal" stroke="#1976D2" strokeWidth={2} />
      </Chart>
    </ChartProvider>
  );
};

export default {
  title: 'Advanced Features',
  variants: [
    { name: 'Significance Brackets', component: SignificanceBracketsDemo },
    { name: 'Highlighted Regions', component: HighlightedRegionsDemo },
    { name: 'Data Annotations', component: DataAnnotationsDemo },
    { name: 'Scale Bar', component: ScaleBarDemo },
    { name: 'Combined Features', component: CombinedFeaturesDemo },
    { name: 'Multi-Region Highlighting', component: MultiRegionDemo }
  ]
};
