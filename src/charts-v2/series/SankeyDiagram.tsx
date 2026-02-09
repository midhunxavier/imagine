/**
 * SankeyDiagram Component - Flow diagram for energy/material flows
 */

import { useMemo } from 'react';
import type { SankeyNode, SankeyLink } from '../utils/engineering';

export interface SankeyDiagramProps {
  /** Sankey nodes */
  nodes: SankeyNode[];
  
  /** Sankey links/flows */
  links: SankeyLink[];
  
  /** Width of the diagram */
  width?: number;
  
  /** Height of the diagram */
  height?: number;
  
  /** Node width */
  nodeWidth?: number;
  
  /** Color palette for nodes */
  colorPalette?: string[];
  
  /** Show node values */
  showValues?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin around diagram */
  margin?: { top: number; right: number; bottom: number; left: number };
}

export function SankeyDiagram({
  nodes,
  links,
  width = 900,
  height = 500,
  nodeWidth = 20,
  colorPalette = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'],
  showValues = true,
  backgroundColor = 'white',
  margin = { top: 40, right: 100, bottom: 40, left: 100 }
}: SankeyDiagramProps) {
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Calculate node positions and values
  const layout = useMemo(() => {
    // Calculate total value for each node
    const nodeValues: { [key: string]: { input: number; output: number } } = {};
    
    nodes.forEach(node => {
      nodeValues[node.id] = { input: 0, output: 0 };
    });
    
    links.forEach(link => {
      if (nodeValues[link.source]) {
        nodeValues[link.source].output += link.value;
      }
      if (nodeValues[link.target]) {
        nodeValues[link.target].input += link.value;
      }
    });
    
    // Determine columns (levels) for nodes
    const columns: { [key: number]: string[] } = {};
    const nodeColumn: { [key: string]: number } = {};
    
    // Start with sources (nodes with no inputs)
    let currentColumn = 0;
    const processed = new Set<string>();
    
    // Find all source nodes
    const sources = nodes.filter(n => nodeValues[n.id].input === 0);
    columns[0] = sources.map(n => n.id);
    sources.forEach(n => {
      nodeColumn[n.id] = 0;
      processed.add(n.id);
    });
    
    // Process remaining nodes
    let changed = true;
    while (changed && processed.size < nodes.length) {
      changed = false;
      links.forEach(link => {
        if (processed.has(link.source) && !processed.has(link.target)) {
          const col = nodeColumn[link.source] + 1;
          if (!columns[col]) columns[col] = [];
          if (!columns[col].includes(link.target)) {
            columns[col].push(link.target);
            nodeColumn[link.target] = col;
            processed.add(link.target);
            changed = true;
          }
        }
      });
    }
    
    // Position nodes in columns
    const maxColumn = Math.max(...Object.values(nodeColumn));
    const nodePositions: { [key: string]: { x: number; y: number; height: number; color: string } } = {};
    
    for (let col = 0; col <= maxColumn; col++) {
      const colNodes = columns[col] || [];
      const colX = (plotWidth / (maxColumn + 1)) * col + (plotWidth / (maxColumn + 1) - nodeWidth) / 2;
      
      let currentY = 0;
      colNodes.forEach((nodeId, i) => {
        const value = Math.max(nodeValues[nodeId].input, nodeValues[nodeId].output) || 1;
        const nodeHeight = Math.max(20, (value / 100) * plotHeight * 0.8);
        
        nodePositions[nodeId] = {
          x: colX,
          y: currentY,
          height: nodeHeight,
          color: colorPalette[i % colorPalette.length]
        };
        
        currentY += nodeHeight + 20;
      });
    }
    
    return { nodePositions, nodeValues, maxColumn };
  }, [nodes, links, plotWidth, plotHeight, nodeWidth, colorPalette]);
  
  const { nodePositions, nodeValues, maxColumn } = layout;
  
  // Calculate link paths
  const linkPaths = useMemo(() => {
    return links.map(link => {
      const source = nodePositions[link.source];
      const target = nodePositions[link.target];
      
      if (!source || !target) return null;
      
      const sourceX = source.x + nodeWidth;
      const sourceY = source.y + source.height / 2;
      const targetX = target.x;
      const targetY = target.y + target.height / 2;
      
      // Bezier curve
      const midX = (sourceX + targetX) / 2;
      const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
      
      // Calculate link thickness based on value
      const thickness = Math.max(2, (link.value / 100) * 30);
      
      return {
        path,
        thickness,
        value: link.value,
        color: source.color
      };
    }).filter(Boolean);
  }, [links, nodePositions, nodeWidth]);
  
  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Render links */}
        {linkPaths.map((link, i) => (
          <g key={`link-${i}`}>
            <path
              d={link!.path}
              fill="none"
              stroke={link!.color}
              strokeWidth={link!.thickness}
              opacity={0.5}
            />
          </g>
        ))}
        
        {/* Render nodes */}
        {nodes.map((node, i) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;
          
          const value = Math.max(nodeValues[node.id].input, nodeValues[node.id].output);
          
          return (
            <g key={`node-${i}`}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={pos.height}
                fill={pos.color}
                stroke="#333"
                strokeWidth={1}
                rx={2}
              />
              <text
                x={pos.x + nodeWidth / 2}
                y={pos.y + pos.height / 2 + 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill="white"
              >
                {node.label}
              </text>
              {showValues && (
                <text
                  x={pos.x + nodeWidth / 2}
                  y={pos.y + pos.height + 15}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#666"
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Title */}
        <text
          x={plotWidth / 2}
          y={-20}
          textAnchor="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#333"
        >
          Sankey Diagram - Flow Visualization
        </text>
      </g>
    </svg>
  );
}
