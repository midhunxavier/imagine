/**
 * ScaleBar Component - Physical measurement scale indicator
 * Shows a scale bar with length and units (e.g., "100 μm", "5 mm")
 */

import React from 'react';

export interface ScaleBarProps {
  /** Length in data units */
  length: number;
  
  /** Unit label (e.g., "μm", "mm", "nm", "km") */
  unit?: string;
  
  /** Position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  
  /** X offset from position (pixels) */
  offsetX?: number;
  
  /** Y offset from position (pixels) */
  offsetY?: number;
  
  /** Bar color */
  color?: string;
  
  /** Bar thickness */
  thickness?: number;
  
  /** Font size for label */
  fontSize?: number;
  
  /** Pixels per data unit (scale factor) */
  pixelsPerUnit?: number;
  
  /** Show tick marks at ends */
  showTicks?: boolean;
  
  /** Tick height */
  tickHeight?: number;
}

export function ScaleBar({
  length,
  unit = '',
  position = 'bottom-right',
  offsetX = 20,
  offsetY = 20,
  color = '#333',
  thickness = 3,
  fontSize = 12,
  pixelsPerUnit = 1,
  showTicks = true,
  tickHeight = 8
}: ScaleBarProps) {
  const barLengthPx = length * pixelsPerUnit;
  const label = unit ? `${length} ${unit}` : `${length}`;
  
  // Calculate position based on viewport (assumes usage within SVG with viewBox)
  // This component should be used as a sibling to Chart or within an absolutely positioned context
  // For now, we'll render at origin and rely on transform
  
  const [x, y, anchor] = (() => {
    switch (position) {
      case 'bottom-left':
        return [offsetX, -offsetY, 'start'];
      case 'bottom-right':
        return [-offsetX, -offsetY, 'end'];
      case 'top-left':
        return [offsetX, offsetY, 'start'];
      case 'top-right':
        return [-offsetX, offsetY, 'end'];
      default:
        return [offsetX, -offsetY, 'start'];
    }
  })();
  
  const textX = anchor === 'end' ? -barLengthPx / 2 : barLengthPx / 2;
  
  return (
    <g className="scale-bar" transform={`translate(${x}, ${y})`}>
      {/* Left tick */}
      {showTicks && (
        <line
          x1={0}
          y1={-tickHeight / 2}
          x2={0}
          y2={tickHeight / 2}
          stroke={color}
          strokeWidth={thickness}
        />
      )}
      
      {/* Bar */}
      <line
        x1={0}
        y1={0}
        x2={barLengthPx}
        y2={0}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="square"
      />
      
      {/* Right tick */}
      {showTicks && (
        <line
          x1={barLengthPx}
          y1={-tickHeight / 2}
          x2={barLengthPx}
          y2={tickHeight / 2}
          stroke={color}
          strokeWidth={thickness}
        />
      )}
      
      {/* Label */}
      <text
        x={textX}
        y={-12}
        textAnchor="middle"
        fontSize={fontSize}
        fill={color}
        fontWeight="500"
      >
        {label}
      </text>
    </g>
  );
}
