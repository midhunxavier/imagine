/**
 * DataAnnotation Component - Callouts and labels for specific data points
 * Adds arrows/lines connecting labels to data points
 */

import React from 'react';
import { useChartContext } from '../ChartContext';

export interface DataAnnotationProps {
  /** X position (data coordinate) to annotate */
  x: number | string;
  
  /** Y position (data coordinate) to annotate */
  y: number;
  
  /** Label text */
  label: string;
  
  /** Label position relative to point */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  /** Distance from point to label (pixels) */
  offset?: number;
  
  /** Show connector line/arrow */
  showConnector?: boolean;
  
  /** Connector style: 'line' | 'arrow' | 'elbow' */
  connectorStyle?: 'line' | 'arrow' | 'elbow';
  
  /** Label background color (for readability) */
  backgroundColor?: string;
  
  /** Label text color */
  textColor?: string;
  
  /** Connector color */
  connectorColor?: string;
  
  /** Font size */
  fontSize?: number;
  
  /** Font weight */
  fontWeight?: number | string;
  
  /** Show point marker at data location */
  showPoint?: boolean;
  
  /** Point marker radius */
  pointRadius?: number;
  
  /** Point marker color */
  pointColor?: string;
}

export function DataAnnotation({
  x,
  y,
  label,
  position = 'top-right',
  offset = 30,
  showConnector = true,
  connectorStyle = 'arrow',
  backgroundColor = 'white',
  textColor = '#333',
  connectorColor = '#666',
  fontSize = 11,
  fontWeight = 500,
  showPoint = true,
  pointRadius = 4,
  pointColor = '#E74C3C'
}: DataAnnotationProps) {
  const context = useChartContext();
  
  if (!context) {
    console.warn('DataAnnotation must be used within a Chart component');
    return null;
  }
  
  const { xScale, yScale } = context;
  
  if (!xScale || !yScale) {
    console.warn('DataAnnotation requires both xScale and yScale');
    return null;
  }
  
  // Convert data coordinates to pixel coordinates
  const px = typeof x === 'number' ? (xScale as any)(x) : (xScale as any)(x);
  const py = (yScale as any)(y);
  
  if (px === undefined || py === undefined) {
    console.warn('DataAnnotation: Could not scale coordinates');
    return null;
  }
  
  // Calculate label position based on desired placement
  const getLabelPosition = (): { x: number; y: number; anchor: 'start' | 'middle' | 'end'; baseline: 'auto' | 'text-before-edge' | 'middle' | 'central' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' } => {
    const angleMap: Record<string, number> = {
      'top': 90,
      'top-right': 45,
      'right': 0,
      'bottom-right': -45,
      'bottom': -90,
      'bottom-left': -135,
      'left': 180,
      'top-left': 135
    };
    
    const angle = (angleMap[position] || 45) * (Math.PI / 180);
    const labelX = px + Math.cos(angle) * offset;
    const labelY = py - Math.sin(angle) * offset;
    
    // Determine text anchor based on position
    let anchor: 'start' | 'middle' | 'end' = 'middle';
    let baseline: 'auto' | 'text-before-edge' | 'middle' | 'central' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' = 'middle';
    
    if (position.includes('right')) anchor = 'start';
    if (position.includes('left')) anchor = 'end';
    if (position === 'top' || position === 'bottom') anchor = 'middle';
    
    if (position.includes('top')) baseline = 'text-after-edge';
    if (position.includes('bottom')) baseline = 'text-before-edge';
    if (position === 'left' || position === 'right') baseline = 'middle';
    
    return { x: labelX, y: labelY, anchor, baseline };
  };
  
  const labelPos = getLabelPosition();
  
  // Generate connector path
  const getConnectorPath = (): string => {
    if (connectorStyle === 'line') {
      return `M ${px} ${py} L ${labelPos.x} ${labelPos.y}`;
    } else if (connectorStyle === 'elbow') {
      const midX = (px + labelPos.x) / 2;
      return `M ${px} ${py} L ${midX} ${py} L ${midX} ${labelPos.y} L ${labelPos.x} ${labelPos.y}`;
    } else {
      // Arrow - draw line and arrowhead
      return `M ${px} ${py} L ${labelPos.x} ${labelPos.y}`;
    }
  };
  
  return (
    <g className="data-annotation">
      {/* Point marker */}
      {showPoint && (
        <circle
          cx={px}
          cy={py}
          r={pointRadius}
          fill={pointColor}
          stroke="white"
          strokeWidth={1.5}
        />
      )}
      
      {/* Connector */}
      {showConnector && (
        <>
          <path
            d={getConnectorPath()}
            stroke={connectorColor}
            strokeWidth={1.5}
            fill="none"
            opacity={0.7}
          />
          
          {/* Arrow head */}
          {connectorStyle === 'arrow' && (
            <polygon
              points={`${labelPos.x},${labelPos.y} ${labelPos.x - 4},${labelPos.y - 3} ${labelPos.x - 4},${labelPos.y + 3}`}
              fill={connectorColor}
              opacity={0.7}
            />
          )}
        </>
      )}
      
      {/* Label background */}
      <rect
        x={labelPos.x - (labelPos.anchor === 'end' ? 100 : labelPos.anchor === 'start' ? 0 : 50)}
        y={labelPos.y - 10}
        width={100}
        height={20}
        fill={backgroundColor}
        opacity={0.9}
        rx={3}
      />
      
      {/* Label text */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor={labelPos.anchor}
        dominantBaseline={labelPos.baseline}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fill={textColor}
      >
        {label}
      </text>
    </g>
  );
}
