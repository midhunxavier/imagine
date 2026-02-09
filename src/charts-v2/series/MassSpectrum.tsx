/**
 * MassSpectrum Component - Mass spectrometry visualization
 */

import { useMemo } from 'react';
import type { MassSpectrum as MassSpectrumType } from '../utils/chemistry';

export interface MassSpectrumProps {
  /** Mass spectrum data */
  data: MassSpectrumType;
  
  /** Width of the spectrum */
  width?: number;
  
  /** Height of the spectrum */
  height?: number;
  
  /** Bar color */
  barColor?: string;
  
  /** Base peak color (highest intensity) */
  basePeakColor?: string;
  
  /** Molecular ion color */
  molecularIonColor?: string;
  
  /** Show peak labels */
  showPeakLabels?: boolean;
  
  /** Show m/z values */
  showMZ?: boolean;
  
  /** Show relative intensity */
  showIntensity?: boolean;
  
  /** Minimum intensity threshold (%) to show peak */
  minIntensity?: number;
  
  /** Margin around spectrum */
  margin?: { top: number; right: number; bottom: number; left: number };
}

export function MassSpectrum({
  data,
  width = 800,
  height = 400,
  barColor = '#4CAF50',
  basePeakColor = '#F44336',
  molecularIonColor = '#2196F3',
  showPeakLabels = true,
  showMZ = true,
  showIntensity = false,
  minIntensity = 5,
  margin = { top: 40, right: 40, bottom: 60, left: 60 }
}: MassSpectrumProps) {
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Filter peaks by minimum intensity
  const filteredPeaks = useMemo(() => {
    return data.peaks.filter(p => p.intensity >= minIntensity);
  }, [data.peaks, minIntensity]);
  
  // Find base peak (highest intensity)
  const basePeak = useMemo(() => {
    return data.peaks.reduce((max, p) => p.intensity > max.intensity ? p : max, data.peaks[0]);
  }, [data.peaks]);
  
  // Scale functions
  const scaleX = (mz: number) => {
    const [minMZ, maxMZ] = data.xDomain;
    return ((mz - minMZ) / (maxMZ - minMZ)) * plotWidth;
  };
  
  const scaleY = (intensity: number) => {
    return plotHeight - (intensity / 100) * plotHeight;
  };
  
  // Bar width calculation
  const barWidth = Math.max(1, plotWidth / (filteredPeaks.length * 3));
  
  // Determine peak color
  const getPeakColor = (peak: typeof data.peaks[0]) => {
    if (peak.isBasePeak) return basePeakColor;
    if (data.molecularIon && Math.abs(peak.mz - data.molecularIon) < 1) return molecularIonColor;
    return barColor;
  };
  
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        <g>
          {/* Horizontal grid */}
          {[0, 20, 40, 60, 80, 100].map((tick, i) => (
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
        </g>
        
        {/* Peak bars */}
        {filteredPeaks.map((peak, i) => {
          const x = scaleX(peak.mz);
          const y = scaleY(peak.intensity);
          const color = getPeakColor(peak);
          
          return (
            <g key={`peak-${i}`}>
              {/* Peak bar */}
              <line
                x1={x}
                y1={plotHeight}
                x2={x}
                y2={y}
                stroke={color}
                strokeWidth={barWidth}
              />
              
              {/* Peak label */}
              {showPeakLabels && (
                <g>
                  {/* m/z value */}
                  {showMZ && (
                    <text
                      x={x}
                      y={y - 5}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#333"
                      fontWeight="bold"
                    >
                      {peak.mz.toFixed(0)}
                    </text>
                  )}
                  
                  {/* Intensity */}
                  {showIntensity && (
                    <text
                      x={x}
                      y={y - (showMZ ? 15 : 5)}
                      textAnchor="middle"
                      fontSize={8}
                      fill="#666"
                    >
                      {peak.intensity.toFixed(0)}%
                    </text>
                  )}
                  
                  {/* Fragment label */}
                  {peak.label && (
                    <text
                      x={x}
                      y={y - (showMZ ? 15 : 5) - (showIntensity ? 12 : 0)}
                      textAnchor="middle"
                      fontSize={9}
                      fill={color}
                      fontWeight="bold"
                    >
                      {peak.label}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
        
        {/* Molecular ion marker */}
        {data.molecularIon && (
          <g>
            <line
              x1={scaleX(data.molecularIon)}
              y1={0}
              x2={scaleX(data.molecularIon)}
              y2={plotHeight}
              stroke={molecularIonColor}
              strokeWidth={2}
              strokeDasharray="5,5"
              opacity={0.5}
            />
            <text
              x={scaleX(data.molecularIon)}
              y={-10}
              textAnchor="middle"
              fontSize={11}
              fill={molecularIonColor}
              fontWeight="bold"
            >
              M⁺ = {data.molecularIon}
            </text>
          </g>
        )}
        
        {/* Base peak marker */}
        <text
          x={plotWidth}
          y={15}
          textAnchor="end"
          fontSize={10}
          fill={basePeakColor}
        >
          Base Peak: m/z {basePeak.mz.toFixed(0)} ({basePeak.intensity.toFixed(0)}%)
        </text>
        
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
          m/z
        </text>
        
        {/* X-axis ticks */}
        {(() => {
          const [minMZ, maxMZ] = data.xDomain;
          const step = Math.ceil((maxMZ - minMZ) / 10 / 10) * 10;
          const ticks = [];
          for (let mz = Math.ceil(minMZ / step) * step; mz <= maxMZ; mz += step) {
            ticks.push(mz);
          }
          
          return ticks.map((mz, i) => {
            const x = scaleX(mz);
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
                  {mz}
                </text>
              </g>
            );
          });
        })()}
        
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
          Relative Intensity (%)
        </text>
        
        {/* Y-axis ticks */}
        {[0, 20, 40, 60, 80, 100].map((tick, i) => (
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
          Mass Spectrum ({data.ionization})
        </text>
        
        {/* Legend */}
        <g transform={`translate(10, ${plotHeight - 60})`}>
          <rect x={0} y={0} width={10} height={10} fill={barColor} />
          <text x={15} y={9} fontSize={10} fill="#333">Fragment</text>
          
          <rect x={0} y={15} width={10} height={10} fill={basePeakColor} />
          <text x={15} y={24} fontSize={10} fill="#333">Base Peak</text>
          
          {data.molecularIon && (
            <>
              <rect x={0} y={30} width={10} height={10} fill={molecularIonColor} />
              <text x={15} y={39} fontSize={10} fill="#333">Molecular Ion</text>
            </>
          )}
        </g>
      </g>
    </svg>
  );
}
