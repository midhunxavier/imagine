/**
 * Export & Integration Demo
 * Phase 8 showcase - Responsive layouts, high-DPI export, performance optimization
 */

import React, { useRef } from 'react';
import {
  Chart, ChartProvider,
  XAxis, YAxis,
  LineSeries, BarSeries, ScatterSeries,
  ResponsiveChart, ExportControls, CanvasScatterSeries,
  Title, Legend
} from '../../../src/charts-v2';

// Variant 1: Responsive Chart
// This component adjusts to the container size
export const ResponsiveChartDemo = () => {
  const data = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: Math.sin(i / 3) * 10 + i
  }));
  
  return (
    <div style={{ width: '100%', height: '400px', border: '1px dashed #ccc', padding: '10px' }}>
      <ResponsiveChart>
        {({ width, height }) => (
          <ChartProvider data={data} width={width} height={height}>
            <Chart data={data} width={width} height={height}>
              <Title text="Resize the window to test responsiveness" />
              <XAxis label="X Axis" />
              <YAxis label="Y Axis" />
              <LineSeries x="x" y="y" stroke="#e74c3c" strokeWidth={2} />
            </Chart>
          </ChartProvider>
        )}
      </ResponsiveChart>
    </div>
  );
};

// Variant 2: Export Controls
// Allows downloading the chart as PNG or SVG
export const ExportDemo = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const data = [
    { category: 'A', value: 10 },
    { category: 'B', value: 20 },
    { category: 'C', value: 15 },
    { category: 'D', value: 25 }
  ];
  
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <ExportControls chartRef={chartRef} fileName="my-chart" />
      </div>
      
      <div ref={chartRef} style={{ border: '1px solid #eee' }}>
        <ChartProvider data={data} width={600} height={400}>
          <Chart data={data} width={600} height={400}>
            <Title text="Downloadable Chart" subtitle="Use buttons above" />
            <XAxis label="Category" />
            <YAxis label="Value" />
            <BarSeries x="category" y="value" fill="#3498db" />
          </Chart>
        </ChartProvider>
      </div>
    </div>
  );
};

// Variant 3: Canvas Scatter Plot (Performance)
// Renders 5,000 points using Canvas inside SVG foreignObject
export const PerformanceDemo = () => {
  // Generate 5000 points
  const data = Array.from({ length: 5000 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    cluster: Math.floor(Math.random() * 3)
  }));
  
  return (
    <ChartProvider data={data} width={700} height={500}>
      <Chart data={data} width={700} height={500}>
        <Title text="High-Performance Scatter (5,000 points)" subtitle="Using Canvas rendering" />
        <XAxis label="X" />
        <YAxis label="Y" />
        
        {/* Use CanvasScatterSeries instead of standard ScatterSeries */}
        <CanvasScatterSeries 
          x="x" 
          y="y" 
          color="#2ecc71" 
          size={2} 
          opacity={0.4} 
        />
      </Chart>
    </ChartProvider>
  );
};

// Variant 4: Dashboard Integration
// Multiple charts in a grid layout
export const DashboardDemo = () => {
  const data1 = Array.from({ length: 10 }, (_, i) => ({ x: i, y: i * i }));
  const data2 = Array.from({ length: 10 }, (_, i) => ({ x: i, y: Math.sqrt(i) }));
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px',
      width: '100%'
    }}>
      <div style={{ height: '300px', border: '1px solid #eee' }}>
        <ResponsiveChart>
          {({ width, height }) => (
            <ChartProvider data={data1} width={width} height={height}>
              <Chart data={data1} width={width} height={height}>
                <Title text="Quadratic Growth" />
                <XAxis />
                <YAxis />
                <LineSeries x="x" y="y" stroke="#9b59b6" />
              </Chart>
            </ChartProvider>
          )}
        </ResponsiveChart>
      </div>
      
      <div style={{ height: '300px', border: '1px solid #eee' }}>
        <ResponsiveChart>
          {({ width, height }) => (
            <ChartProvider data={data2} width={width} height={height}>
              <Chart data={data2} width={width} height={height}>
                <Title text="Square Root Growth" />
                <XAxis />
                <YAxis />
                <LineSeries x="x" y="y" stroke="#e67e22" />
              </Chart>
            </ChartProvider>
          )}
        </ResponsiveChart>
      </div>
    </div>
  );
};

export default {
  title: 'Export & Integration',
  variants: [
    { name: 'Responsive Chart', component: ResponsiveChartDemo },
    { name: 'Export Controls', component: ExportDemo },
    { name: 'Performance (Canvas)', component: PerformanceDemo },
    { name: 'Dashboard Layout', component: DashboardDemo }
  ]
};
