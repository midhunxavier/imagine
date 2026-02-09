/**
 * PhaseDiagram Component - Phase transition visualization
 */

import React from 'react';
import type { PhaseRegion } from '../utils/physics';

export interface PhaseDiagramProps {
  /** Regions to display */
  regions: PhaseRegion[];
  
  /** Width of the diagram */
  width?: number;
  
  /** Height of the diagram */
  height?: number;
  
  /** Margin */
  margin?: { top: number; right: number; bottom: number; left: number };
  
  /** Title */
  title?: string;
  
  /** X-axis label (Temperature) */
  xLabel?: string;
  
  /** Y-axis label (Pressure) */
  yLabel?: string;
}

export function PhaseDiagram({
  regions,
  width = 500,
  height = 400,
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
  title,
  xLabel = 'Temperature (K)',
  yLabel = 'Pressure (atm)'
}: PhaseDiagramProps) {
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Determine bounds (log scale for pressure usually)
  // For simplicity, using linear scale for now or based on region definitions
  const minTemp = 0;
  const maxTemp = 1000;
  const minPressure = 0;
  const maxPressure = 100;
  
  const scaleX = (t: number) => (t / maxTemp) * plotWidth;
  const scaleY = (p: number) => plotHeight - (p / maxPressure) * plotHeight;
  
  // Helper to create path for a region
  // This is a simplified visualization that draws boxes/areas based on bounds
  // Real phase diagrams have curved boundaries (Clapeyron equation)
  // We'll approximate with polygons based on the provided ranges
  
  return (
    <svg width={width} height={height} style={{ backgroundColor: 'white' }}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Title */}
        {title && (
          <text
            x={plotWidth / 2}
            y={-20}
            textAnchor="middle"
            fontSize={16}
            fontWeight="bold"
            fill="#333"
          >
            {title}
          </text>
        )}
        
        {/* Regions */}
        {regions.map((region, i) => {
          const x1 = scaleX(region.temperature[0]);
          const x2 = scaleX(region.temperature[1]);
          const y1 = scaleY(region.pressure[1]); // Higher pressure = lower y (SVG coords)
          const y2 = scaleY(region.pressure[0]); // Lower pressure = higher y
          
          return (
            <g key={i}>
              <rect
                x={x1}
                y={y1}
                width={Math.max(0, x2 - x1)}
                height={Math.max(0, y2 - y1)}
                fill={region.color}
                opacity={0.7}
                stroke="white"
                strokeWidth={1}
              />
              <text
                x={x1 + (x2 - x1) / 2}
                y={y1 + (y2 - y1) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fill="#333"
                fontWeight="bold"
              >
                {region.name}
              </text>
            </g>
          );
        })}
        
        {/* Axes */}
        <g>
          {/* X Axis */}
          <line x1={0} y1={plotHeight} x2={plotWidth} y2={plotHeight} stroke="#333" strokeWidth={2} />
          <text x={plotWidth / 2} y={plotHeight + 35} textAnchor="middle" fontSize={12}>
            {xLabel}
          </text>
          
          {/* Y Axis */}
          <line x1={0} y1={0} x2={0} y2={plotHeight} stroke="#333" strokeWidth={2} />
          <text
            x={-35}
            y={plotHeight / 2}
            textAnchor="middle"
            fontSize={12}
            transform={`rotate(-90, -35, ${plotHeight / 2})`}
          >
            {yLabel}
          </text>
        </g>
        
        {/* Ticks */}
        {/* Simple ticks for context */}
        {[0, 273, 373, 1000].map(t => (
          <g key={`xtick-${t}`} transform={`translate(${scaleX(t)}, ${plotHeight})`}>
            <line y2={5} stroke="#333" />
            <text y={20} textAnchor="middle" fontSize={10}>{t}</text>
          </g>
        ))}
        {[0.1, 1, 100].map(p => (
          <g key={`ytick-${p}`} transform={`translate(0, ${scaleY(p)})`}>
            <line x2={-5} stroke="#333" />
            <text x={-10} textAnchor="end" dominantBaseline="middle" fontSize={10}>{p}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
