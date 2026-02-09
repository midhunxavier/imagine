/**
 * SignificanceBracket Component - Statistical significance indicators
 * Used to show pairwise comparisons between groups with p-values
 */

import React from 'react';
import { useChartContext } from '../ChartContext';

export interface SignificanceBracketProps {
  /** X positions (data coordinates) to connect [x1, x2] */
  x1: number | string;
  x2: number | string;
  
  /** Y position (data coordinate) for the bracket */
  y: number;
  
  /** Significance label (e.g., "*", "**", "***", "ns", "p<0.05") */
  label?: string;
  
  /** Height of the bracket lines */
  barHeight?: number;
  
  /** Stroke color */
  color?: string;
  
  /** Stroke width */
  strokeWidth?: number;
  
  /** Font size for label */
  fontSize?: number;
  
  /** Tip style: 'bar' or 'arrow' */
  tipStyle?: 'bar' | 'arrow';
  
  /** Offset from y position */
  yOffset?: number;
}

export function SignificanceBracket({
  x1,
  x2,
  y,
  label = '***',
  barHeight = 10,
  color = '#333',
  strokeWidth = 1.5,
  fontSize = 12,
  tipStyle = 'bar',
  yOffset = 0
}: SignificanceBracketProps) {
  const context = useChartContext();
  
  if (!context) {
    console.warn('SignificanceBracket must be used within a Chart component');
    return null;
  }
  
  const { xScale, yScale } = context;
  
  if (!xScale || !yScale) {
    console.warn('SignificanceBracket requires both xScale and yScale');
    return null;
  }
  
  // Convert data coordinates to pixel coordinates
  const px1 = typeof x1 === 'number' ? (xScale as any)(x1) : (xScale as any)(x1);
  const px2 = typeof x2 === 'number' ? (xScale as any)(x2) : (xScale as any)(x2);
  const py = (yScale as any)(y) + yOffset;
  
  if (px1 === undefined || px2 === undefined || py === undefined) {
    console.warn('SignificanceBracket: Could not scale coordinates');
    return null;
  }
  
  // Ensure px1 < px2
  const [left, right] = px1 < px2 ? [px1, px2] : [px2, px1];
  const midX = (left + right) / 2;
  
  return (
    <g className="significance-bracket">
      {/* Left vertical line */}
      {tipStyle === 'bar' ? (
        <line
          x1={left}
          y1={py}
          x2={left}
          y2={py - barHeight}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ) : (
        <path
          d={`M ${left} ${py} L ${left - 3} ${py - 5} M ${left} ${py} L ${left + 3} ${py - 5}`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )}
      
      {/* Horizontal line */}
      <line
        x1={left}
        y1={py - (tipStyle === 'bar' ? barHeight : 5)}
        x2={right}
        y2={py - (tipStyle === 'bar' ? barHeight : 5)}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      
      {/* Right vertical line */}
      {tipStyle === 'bar' ? (
        <line
          x1={right}
          y1={py}
          x2={right}
          y2={py - barHeight}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ) : (
        <path
          d={`M ${right} ${py} L ${right - 3} ${py - 5} M ${right} ${py} L ${right + 3} ${py - 5}`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )}
      
      {/* Label */}
      {label && (
        <text
          x={midX}
          y={py - barHeight - 5}
          textAnchor="middle"
          fontSize={fontSize}
          fill={color}
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </g>
  );
}
