/**
 * SystemDiagram Component - Block diagrams for systems engineering
 */

import { useMemo } from 'react';
import type { SystemBlock } from '../utils/engineering';

export interface SystemDiagramProps {
  /** System blocks */
  blocks: SystemBlock[];
  
  /** Connections between blocks */
  connections: { from: string; to: string; label?: string }[];
  
  /** Width of the diagram */
  width?: number;
  
  /** Height of the diagram */
  height?: number;
  
  /** Block color */
  blockColor?: string;
  
  /** Show connection labels */
  showLabels?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin around diagram */
  margin?: number;
}

export function SystemDiagram({
  blocks,
  connections,
  width = 800,
  height = 400,
  blockColor = '#2196F3',
  showLabels = true,
  backgroundColor = 'white',
  margin = 40
}: SystemDiagramProps) {
  // Create block lookup
  const blockMap = useMemo(() => {
    const map = new Map<string, SystemBlock>();
    blocks.forEach(block => map.set(block.id, block));
    return map;
  }, [blocks]);
  
  // Calculate input/output positions
  const getConnectionPoint = (block: SystemBlock, isInput: boolean) => {
    const x = (block.x || 0) + (isInput ? 0 : (block.width || 100));
    const y = (block.y || 0) + (block.height || 60) / 2;
    return { x, y };
  };
  
  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      <g transform={`translate(${margin}, ${margin})`}>
        {/* Render connections first (behind blocks) */}
        {connections.map((conn, i) => {
          const fromBlock = blockMap.get(conn.from);
          const toBlock = blockMap.get(conn.to);
          
          if (!fromBlock || !toBlock) return null;
          
          const start = getConnectionPoint(fromBlock, false);
          const end = getConnectionPoint(toBlock, true);
          
          // Create elbow connector
          const midX = (start.x + end.x) / 2;
          const path = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
          
          return (
            <g key={`conn-${i}`}>
              <path
                d={path}
                fill="none"
                stroke="#666"
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
              {showLabels && conn.label && (
                <text
                  x={midX}
                  y={(start.y + end.y) / 2 - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                  style={{ backgroundColor: 'white' }}
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Render blocks */}
        {blocks.map((block, i) => (
          <g key={`block-${i}`}>
            <rect
              x={block.x || 0}
              y={block.y || 0}
              width={block.width || 100}
              height={block.height || 60}
              fill={block.color || blockColor}
              stroke="#333"
              strokeWidth={2}
              rx={4}
            />
            <text
              x={(block.x || 0) + (block.width || 100) / 2}
              y={(block.y || 0) + (block.height || 60) / 2 + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill="white"
            >
              {block.label}
            </text>
            
            {/* Input labels */}
            {block.inputs?.map((input, j) => (
              <text
                key={`input-${j}`}
                x={(block.x || 0) - 5}
                y={(block.y || 0) + 15 + j * 15}
                textAnchor="end"
                fontSize={9}
                fill="#666"
              >
                {input}
              </text>
            ))}
            
            {/* Output labels */}
            {block.outputs?.map((output, j) => (
              <text
                key={`output-${j}`}
                x={(block.x || 0) + (block.width || 100) + 5}
                y={(block.y || 0) + 15 + j * 15}
                textAnchor="start"
                fontSize={9}
                fill="#666"
              >
                {output}
              </text>
            ))}
          </g>
        ))}
        
        {/* Arrow marker */}
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#666" />
          </marker>
        </defs>
      </g>
    </svg>
  );
}
