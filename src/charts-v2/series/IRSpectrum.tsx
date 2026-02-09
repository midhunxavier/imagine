/**
 * IRSpectrum Component - Infrared spectroscopy visualization
 */

import { useMemo } from 'react';
import type { IRSpectrum as IRSpectrumType } from '../utils/chemistry';

export interface IRSpectrumProps {
  /** IR spectrum data */
  data: IRSpectrumType;
  
  /** Width of the spectrum */
  width?: number;
  
  /** Height of the spectrum */
  height?: number;
  
  /** Line color */
  lineColor?: string;
  
  /** Line width */
  lineWidth?: number;
  
  /** Show grid lines */
  showGrid?: boolean;
  
  /** Show peak labels */
  showPeakLabels?: boolean;
  
  /** Show functional group regions */
  showFunctionalGroups?: boolean;
  
  /** Fill area under curve */
  fillArea?: boolean;
  
  /** Fill opacity */
  fillOpacity?: number;
  
  /** Margin around spectrum */
  margin?: { top: number; right: number; bottom: number; left: number };
}

export function IRSpectrum({
  data,
  width = 800,
  height = 400,
  lineColor = '#E91E63',
  lineWidth = 1.5,
  showGrid = true,
  showPeakLabels = true,
  showFunctionalGroups = true,
  fillArea = true,
  fillOpacity = 0.2,
  margin = { top: 40, right: 40, bottom: 60, left: 60 }
}: IRSpectrumProps) {
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Generate baseline spectrum (typical IR baseline shape)
  const baselineData = useMemo(() => {
    const [minWavenumber, maxWavenumber] = data.xDomain;
    const numPoints = 400;
    const points: { x: number; y: number }[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const wavenumber = minWavenumber + (maxWavenumber - minWavenumber) * (i / (numPoints - 1));
      
      // Baseline starts at 95% transmittance and gradually decreases
      let transmittance = 95 - (wavenumber - minWavenumber) * 0.02;
      
      // Add Gaussian peaks for each absorption
      for (const peak of data.peaks) {
        const sigma = 20; // Peak width
        const delta = wavenumber - peak.wavenumber;
        transmittance -= (95 - peak.transmittance) * Math.exp(-(delta ** 2) / (2 * sigma ** 2));
      }
      
      points.push({ x: wavenumber, y: Math.max(0, Math.min(100, transmittance)) });
    }
    
    return points;
  }, [data]);
  
  // Scale functions (IR x-axis is reversed - high wavenumber on left)
  const scaleX = (wavenumber: number) => {
    const [minWavenumber, maxWavenumber] = data.xDomain;
    return plotWidth - ((wavenumber - minWavenumber) / (maxWavenumber - minWavenumber)) * plotWidth;
  };
  
  const scaleY = (transmittance: number) => {
    return (transmittance / 100) * plotHeight;
  };
  
  // Generate path
  const pathD = baselineData.map((point, i) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Fill area path
  const fillPathD = `${pathD} L ${scaleX(baselineData[baselineData.length - 1].x)} ${plotHeight} L ${scaleX(baselineData[0].x)} ${plotHeight} Z`;
  
  // Functional group regions
  const functionalGroups = [
    { name: 'O-H/N-H', range: [3200, 3600], color: 'rgba(33, 150, 243, 0.1)' },
    { name: 'C-H', range: [2850, 3000], color: 'rgba(76, 175, 80, 0.1)' },
    { name: 'C=O', range: [1650, 1750], color: 'rgba(244, 67, 54, 0.1)' },
    { name: 'C=C', range: [1620, 1680], color: 'rgba(255, 152, 0, 0.1)' },
    { name: 'C-O', range: [1000, 1300], color: 'rgba(0, 188, 212, 0.1)' }
  ];
  
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Functional group regions */}
        {showFunctionalGroups && functionalGroups.map((group, i) => {
          const x1 = scaleX(group.range[1]);
          const x2 = scaleX(group.range[0]);
          const width = x2 - x1;
          
          return (
            <g key={`fg-${i}`}>
              <rect
                x={x1}
                y={0}
                width={width}
                height={plotHeight}
                fill={group.color}
              />
              <text
                x={(x1 + x2) / 2}
                y={15}
                textAnchor="middle"
                fontSize={9}
                fill="#666"
              >
                {group.name}
              </text>
            </g>
          );
        })}
        
        {/* Grid lines */}
        {showGrid && (
          <g>
            {/* Horizontal grid */}
            {[0, 25, 50, 75, 100].map((tick, i) => (
              <line
                key={`h-grid-${i}`}
                x1={0}
                y1={scaleY(tick)}
                x2={plotWidth}
                y2={scaleY(tick)}
                stroke="#E0E0E0"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Vertical grid */}
            {[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map((wavenumber, i) => {
              const x = scaleX(wavenumber);
              if (x >= 0 && x <= plotWidth) {
                return (
                  <line
                    key={`v-grid-${i}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={plotHeight}
                    stroke="#E0E0E0"
                    strokeWidth={1}
                    strokeDasharray="2,2"
                  />
                );
              }
              return null;
            })}
          </g>
        )}
        
        {/* Fill area */}
        {fillArea && (
          <path
            d={fillPathD}
            fill={lineColor}
            opacity={fillOpacity}
          />
        )}
        
        {/* Spectrum line */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
        />
        
        {/* Peak labels */}
        {showPeakLabels && data.peaks.map((peak, i) => {
          const x = scaleX(peak.wavenumber);
          const y = scaleY(peak.transmittance);
          
          return (
            <g key={`peak-${i}`}>
              {/* Peak marker */}
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={plotHeight}
                stroke="#333"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.5}
              />
              
              {/* Wavenumber label */}
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fontSize={9}
                fill="#333"
                fontWeight="bold"
              >
                {peak.wavenumber}
              </text>
              
              {/* Functional group label */}
              {peak.functionalGroup && (
                <text
                  x={x}
                  y={y - 22}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#666"
                >
                  {peak.functionalGroup}
                </text>
              )}
            </g>
          );
        })}
        
        {/* X-axis */}
        <line
          x1={0}
          y1={plotHeight}
          x2={plotWidth}
          y2={plotHeight}
          stroke="#333"
          strokeWidth={2}
        />
        
        {/* X-axis label */}
        <text
          x={plotWidth / 2}
          y={plotHeight + 45}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#333"
        >
          Wavenumber (cm⁻¹)
        </text>
        
        {/* X-axis ticks */}
        {[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map((wavenumber, i) => {
          const x = scaleX(wavenumber);
          if (x >= 0 && x <= plotWidth) {
            return (
              <g key={`x-tick-${i}`}>
                <line
                  x1={x}
                  y1={plotHeight}
                  x2={x}
                  y2={plotHeight + 5}
                  stroke="#333"
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={plotHeight + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#333"
                >
                  {wavenumber}
                </text>
              </g>
            );
          }
          return null;
        })}
        
        {/* Y-axis */}
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={plotHeight}
          stroke="#333"
          strokeWidth={2}
        />
        
        {/* Y-axis label */}
        <text
          x={-40}
          y={plotHeight / 2}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#333"
          transform={`rotate(-90, -40, ${plotHeight / 2})`}
        >
          Transmittance (%)
        </text>
        
        {/* Y-axis ticks */}
        {[0, 25, 50, 75, 100].map((tick, i) => (
          <g key={`y-tick-${i}`}>
            <line
              x1={-5}
              y1={scaleY(tick)}
              x2={0}
              y2={scaleY(tick)}
              stroke="#333"
              strokeWidth={2}
            />
            <text
              x={-10}
              y={scaleY(tick) + 4}
              textAnchor="end"
              fontSize={11}
              fill="#333"
            >
              {tick}
            </text>
          </g>
        ))}
        
        {/* Title */}
        <text
          x={plotWidth / 2}
          y={-20}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#333"
        >
          IR Spectrum
        </text>
      </g>
    </svg>
  );
}
