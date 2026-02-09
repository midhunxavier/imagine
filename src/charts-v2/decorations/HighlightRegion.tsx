/**
 * HighlightRegion Component - Emphasize specific data ranges
 * Adds shaded regions to highlight areas of interest (e.g., significant ranges, time periods)
 */

import React from 'react';
import { useChartContext } from '../ChartContext';

export interface HighlightRegionProps {
  /** Start of region (x-axis, data coordinate) */
  xStart?: number | string;
  
  /** End of region (x-axis, data coordinate) */
  xEnd?: number | string;
  
  /** Start of region (y-axis, data coordinate) */
  yStart?: number;
  
  /** End of region (y-axis, data coordinate) */
  yEnd?: number;
  
  /** Fill color */
  fill?: string;
  
  /** Opacity */
  opacity?: number;
  
  /** Stroke color (border) */
  stroke?: string;
  
  /** Stroke width */
  strokeWidth?: number;
  
  /** Stroke dash array (for dashed borders) */
  strokeDasharray?: string;
  
  /** Label for the region */
  label?: string;
  
  /** Label position: 'top' | 'bottom' | 'center' */
  labelPosition?: 'top' | 'bottom' | 'center';
  
  /** Label font size */
  labelFontSize?: number;
  
  /** Label color */
  labelColor?: string;
  
  /** Direction: 'vertical' | 'horizontal' | 'both' */
  direction?: 'vertical' | 'horizontal' | 'both';
}

export function HighlightRegion({
  xStart,
  xEnd,
  yStart,
  yEnd,
  fill = '#FFD700',
  opacity = 0.2,
  stroke = 'none',
  strokeWidth = 1,
  strokeDasharray,
  label,
  labelPosition = 'top',
  labelFontSize = 11,
  labelColor = '#666',
  direction = 'vertical'
}: HighlightRegionProps) {
  const context = useChartContext();
  
  if (!context) {
    console.warn('HighlightRegion must be used within a Chart component');
    return null;
  }
  
  const { xScale, yScale, plotWidth, plotHeight } = context;
  
  if (!xScale || !yScale) {
    console.warn('HighlightRegion requires both xScale and yScale');
    return null;
  }
  
  // Determine bounds based on direction
  let x1: number, x2: number, y1: number, y2: number;
  
  if (direction === 'vertical' || direction === 'both') {
    // Vertical region (x-axis range)
    if (xStart !== undefined && xEnd !== undefined) {
      x1 = typeof xStart === 'number' ? (xScale as any)(xStart) : (xScale as any)(xStart);
      x2 = typeof xEnd === 'number' ? (xScale as any)(xEnd) : (xScale as any)(xEnd);
    } else {
      console.warn('HighlightRegion: xStart and xEnd required for vertical direction');
      return null;
    }
    
    // Use full y-axis range if not specified
    if (yStart !== undefined && yEnd !== undefined) {
      y1 = (yScale as any)(yStart);
      y2 = (yScale as any)(yEnd);
    } else {
      y1 = 0;
      y2 = plotHeight || 400;
    }
  } else if (direction === 'horizontal') {
    // Horizontal region (y-axis range)
    if (yStart !== undefined && yEnd !== undefined) {
      y1 = (yScale as any)(yStart);
      y2 = (yScale as any)(yEnd);
    } else {
      console.warn('HighlightRegion: yStart and yEnd required for horizontal direction');
      return null;
    }
    
    // Use full x-axis range if not specified
    if (xStart !== undefined && xEnd !== undefined) {
      x1 = typeof xStart === 'number' ? (xScale as any)(xStart) : (xScale as any)(xStart);
      x2 = typeof xEnd === 'number' ? (xScale as any)(xEnd) : (xScale as any)(xEnd);
    } else {
      x1 = 0;
      x2 = plotWidth || 600;
    }
  } else {
    console.warn('HighlightRegion: Invalid direction');
    return null;
  }
  
  if (x1 === undefined || x2 === undefined || y1 === undefined || y2 === undefined) {
    console.warn('HighlightRegion: Could not scale coordinates');
    return null;
  }
  
  // Ensure proper ordering
  const [left, right] = x1 < x2 ? [x1, x2] : [x2, x1];
  const [top, bottom] = y1 < y2 ? [y1, y2] : [y2, y1];
  
  const width = right - left;
  const height = bottom - top;
  
  // Calculate label position
  const labelX = left + width / 2;
  const labelY = labelPosition === 'top' ? top + 15 : labelPosition === 'bottom' ? bottom - 5 : top + height / 2;
  
  return (
    <g className="highlight-region">
      {/* Shaded region */}
      <rect
        x={left}
        y={top}
        width={width}
        height={height}
        fill={fill}
        opacity={opacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
      
      {/* Label */}
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize={labelFontSize}
          fill={labelColor}
          fontWeight="500"
        >
          {label}
        </text>
      )}
    </g>
  );
}
