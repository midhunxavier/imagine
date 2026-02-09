/**
 * VectorField Component - 2D Vector field visualization
 */

import type { Vector } from '../utils/physics';

export interface VectorFieldProps {
  /** Vector data */
  vectors: Vector[];
  
  /** Width of the field */
  width?: number;
  
  /** Height of the field */
  height?: number;
  
  /** Arrow color */
  arrowColor?: string;
  
  /** Show magnitude as color */
  colorByMagnitude?: boolean;
  
  /** Show streamlines */
  showStreamlines?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin around field */
  margin?: number;
  
  /** Title */
  title?: string;
}

export function VectorField({
  vectors,
  width = 600,
  height = 400,
  arrowColor = '#2196F3',
  colorByMagnitude = true,
  showStreamlines = false,
  backgroundColor = 'white',
  margin = 40,
  title
}: VectorFieldProps) {
  // Find magnitude range for color scaling
  const maxMagnitude = Math.max(...vectors.map(v => v.magnitude || Math.sqrt(v.vx * v.vx + v.vy * v.vy)));
  
  // Get color based on magnitude
  const getColor = (magnitude: number) => {
    if (!colorByMagnitude) return arrowColor;
    
    // Gradient from blue (low) to red (high)
    const normalized = magnitude / maxMagnitude;
    const r = Math.floor(255 * normalized);
    const b = Math.floor(255 * (1 - normalized));
    return `rgb(${r}, 100, ${b})`;
  };
  
  // Render a single vector arrow
  const renderArrow = (v: Vector, i: number) => {
    const magnitude = v.magnitude || Math.sqrt(v.vx * v.vx + v.vy * v.vy);
    const color = getColor(magnitude);
    
    // Arrow shaft end
    const endX = v.x + v.vx;
    const endY = v.y + v.vy;
    
    // Arrow head
    const angle = Math.atan2(v.vy, v.vx);
    const arrowLength = 8;
    const arrowAngle = Math.PI / 6;
    
    const arrowX1 = endX - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = endY - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = endX - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = endY - arrowLength * Math.sin(angle + arrowAngle);
    
    return (
      <g key={`vector-${i}`}>
        {/* Arrow shaft */}
        <line
          x1={v.x + margin}
          y1={v.y + margin}
          x2={endX + margin}
          y2={endY + margin}
          stroke={color}
          strokeWidth={2}
        />
        {/* Arrow head */}
        <polygon
          points={`${endX + margin},${endY + margin} ${arrowX1 + margin},${arrowY1 + margin} ${arrowX2 + margin},${arrowY2 + margin}`}
          fill={color}
        />
      </g>
    );
  };
  
  return (
    <svg width={width + 2 * margin} height={height + 2 * margin} style={{ backgroundColor }}>
      <g>
        {/* Title */}
        {title && (
          <text
            x={(width + 2 * margin) / 2}
            y={25}
            textAnchor="middle"
            fontSize={16}
            fontWeight="bold"
            fill="#333"
          >
            {title}
          </text>
        )}
        
        {/* Vectors */}
        {vectors.map((v, i) => renderArrow(v, i))}
        
        {/* Magnitude legend */}
        {colorByMagnitude && (
          <g transform={`translate(${width + margin + 10}, ${margin + 50})`}>
            <text x={0} y={-10} fontSize={11} fill="#666" fontWeight="bold">Magnitude</text>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = i * 30;
              const mag = t * maxMagnitude;
              const color = getColor(mag);
              return (
                <g key={`legend-${i}`} transform={`translate(0, ${y})`}>
                  <rect x={0} y={0} width={20} height={20} fill={color} />
                  <text x={25} y={15} fontSize={10} fill="#666">{mag.toFixed(1)}</text>
                </g>
              );
            })}
          </g>
        )}
        
        {/* Border */}
        <rect
          x={margin}
          y={margin}
          width={width}
          height={height}
          fill="none"
          stroke="#ddd"
          strokeWidth={1}
        />
      </g>
    </svg>
  );
}
