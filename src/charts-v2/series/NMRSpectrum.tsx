/**
 * NMRSpectrum Component - Nuclear Magnetic Resonance spectrum visualization
 */

import { useMemo } from 'react';
import type { NMRSpectrum as NMRSpectrumType } from '../utils/chemistry';

export interface NMRSpectrumProps {
  /** NMR spectrum data */
  data: NMRSpectrumType;
  
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
  
  /** Show integration curves */
  showIntegration?: boolean;
  
  /** Margin around spectrum */
  margin?: { top: number; right: number; bottom: number; left: number };
}

export function NMRSpectrum({
  data,
  width = 800,
  height = 400,
  lineColor = '#2196F3',
  lineWidth = 1.5,
  showGrid = true,
  showPeakLabels = true,
  showIntegration = false,
  margin = { top: 40, right: 40, bottom: 60, left: 60 }
}: NMRSpectrumProps) {
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Generate spectrum line from peaks
  const spectrumData = useMemo(() => {
    const [minPpm, maxPpm] = data.xDomain;
    const numPoints = 500;
    const points: { x: number; y: number }[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const ppm = minPpm + (maxPpm - minPpm) * (i / (numPoints - 1));
      let intensity = 0;
      
      // Sum Lorentzian lineshapes for all peaks
      for (const peak of data.peaks) {
        const gamma = 0.02; // Line width parameter
        const delta = ppm - peak.chemicalShift;
        intensity += (peak.intensity * gamma ** 2) / (delta ** 2 + gamma ** 2);
      }
      
      points.push({ x: ppm, y: intensity });
    }
    
    return points;
  }, [data]);
  
  // Find max intensity for scaling
  const maxIntensity = Math.max(...spectrumData.map(p => p.y));
  
  // Scale functions (NMR x-axis is reversed - high ppm on left)
  const scaleX = (ppm: number) => {
    const [minPpm, maxPpm] = data.xDomain;
    return plotWidth - ((ppm - minPpm) / (maxPpm - minPpm)) * plotWidth;
  };
  
  const scaleY = (intensity: number) => {
    return plotHeight - (intensity / maxIntensity) * plotHeight * 0.9;
  };
  
  // Generate path
  const pathD = spectrumData.map((point, i) => {
    const x = scaleX(point.x);
    const y = scaleY(point.y);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        {showGrid && (
          <g>
            {/* Horizontal grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
              <line
                key={`h-grid-${i}`}
                x1={0}
                y1={tick * plotHeight}
                x2={plotWidth}
                y2={tick * plotHeight}
                stroke="#E0E0E0"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Vertical grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
              const [minPpm, maxPpm] = data.xDomain;
              const ppm = minPpm + (maxPpm - minPpm) * tick;
              const x = scaleX(ppm);
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
            })}
          </g>
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
          const x = scaleX(peak.chemicalShift);
          const y = scaleY(peak.intensity);
          
          return (
            <g key={`peak-${i}`}>
              {/* Peak marker */}
              <circle
                cx={x}
                cy={y}
                r={4}
                fill={lineColor}
              />
              
              {/* Chemical shift label */}
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fontSize={10}
                fill="#333"
                fontWeight="bold"
              >
                {peak.chemicalShift.toFixed(2)}
              </text>
              
              {/* Multiplicity and integration */}
              {(peak.multiplicity || peak.integration) && (
                <text
                  x={x}
                  y={y - 22}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#666"
                >
                  {peak.multiplicity && `${peak.multiplicity}`}
                  {peak.integration && ` (${peak.integration}H)`}
                </text>
              )}
              
              {/* Label if provided */}
              {peak.label && (
                <text
                  x={x}
                  y={plotHeight + 20}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                >
                  {peak.label}
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
          Chemical Shift (ppm)
        </text>
        
        {/* X-axis ticks */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick, i) => {
          const [minPpm, maxPpm] = data.xDomain;
          const ppm = minPpm + (maxPpm - minPpm) * tick;
          const x = scaleX(ppm);
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
                fontSize={12}
                fill="#333"
              >
                {ppm.toFixed(1)}
              </text>
            </g>
          );
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
          Intensity
        </text>
        
        {/* Spectrum info */}
        <text
          x={plotWidth / 2}
          y={-20}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#333"
        >
          {data.nuclei} NMR Spectrum
          {data.solvent && ` (${data.solvent})`}
          {data.frequency && ` - ${data.frequency} MHz`}
        </text>
      </g>
    </svg>
  );
}
