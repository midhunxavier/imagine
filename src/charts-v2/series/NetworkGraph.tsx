/**
 * NetworkGraph Component - Node-link network visualization
 */

import { useMemo } from 'react';
import type { NetworkNode, NetworkEdge } from '../utils/engineering';

export interface NetworkGraphProps {
  /** Network nodes */
  nodes: NetworkNode[];
  
  /** Network edges/links */
  edges: NetworkEdge[];
  
  /** Width of the graph */
  width?: number;
  
  /** Height of the graph */
  height?: number;
  
  /** Show node labels */
  showLabels?: boolean;
  
  /** Show edge weights */
  showWeights?: boolean;
  
  /** Node color palette */
  colorPalette?: string[];
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin around graph */
  margin?: number;
}

export function NetworkGraph({
  nodes,
  edges,
  width = 800,
  height = 600,
  showLabels = true,
  showWeights = true,
  colorPalette = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'],
  backgroundColor = 'white',
  margin = 50
}: NetworkGraphProps) {
  const plotWidth = width - 2 * margin;
  const plotHeight = height - 2 * margin;
  
  // Simple force-directed layout simulation
  const layoutedNodes = useMemo(() => {
    // Start with random positions or predefined
    let positions = nodes.map((node, i) => ({
      ...node,
      x: node.x || plotWidth / 2 + Math.cos((2 * Math.PI * i) / nodes.length) * 200,
      y: node.y || plotHeight / 2 + Math.sin((2 * Math.PI * i) / nodes.length) * 200
    }));
    
    // Simple force simulation (iterative)
    const iterations = 50;
    const k = Math.sqrt((plotWidth * plotHeight) / nodes.length) * 0.5;
    
    for (let iter = 0; iter < iterations; iter++) {
      // Repulsive forces between all nodes
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[j].x! - positions[i].x!;
          const dy = positions[j].y! - positions[i].y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (k * k) / dist;
          
          const fx = (dx / dist) * force * 0.1;
          const fy = (dy / dist) * force * 0.1;
          
          positions[i].x! -= fx;
          positions[i].y! -= fy;
          positions[j].x! += fx;
          positions[j].y! += fy;
        }
      }
      
      // Attractive forces along edges
      edges.forEach(edge => {
        const source = positions.find(n => n.id === edge.from);
        const target = positions.find(n => n.id === edge.to);
        
        if (source && target) {
          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist * dist) / k * 0.05;
          
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          source.x! += fx;
          source.y! += fy;
          target.x! -= fx;
          target.y! -= fy;
        }
      });
      
      // Center gravity
      positions.forEach(node => {
        const dx = node.x! - plotWidth / 2;
        const dy = node.y! - plotHeight / 2;
        node.x! -= dx * 0.01;
        node.y! -= dy * 0.01;
        
        // Keep within bounds
        node.x! = Math.max(20, Math.min(plotWidth - 20, node.x!));
        node.y! = Math.max(20, Math.min(plotHeight - 20, node.y!));
      });
    }
    
    return positions;
  }, [nodes, edges, plotWidth, plotHeight]);
  
  // Create node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof layoutedNodes[0]>();
    layoutedNodes.forEach(node => map.set(node.id, node));
    return map;
  }, [layoutedNodes]);
  
  // Get group colors
  const groups = useMemo(() => {
    const uniqueGroups = [...new Set(nodes.map(n => n.group).filter(Boolean))];
    return uniqueGroups;
  }, [nodes]);
  
  const getNodeColor = (node: typeof layoutedNodes[0]) => {
    if (node.color) return node.color;
    if (node.group) {
      const groupIndex = groups.indexOf(node.group);
      return colorPalette[groupIndex % colorPalette.length];
    }
    return colorPalette[0];
  };
  
  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      <g transform={`translate(${margin}, ${margin})`}>
        {/* Render edges */}
        {edges.map((edge, i) => {
          const source = nodeMap.get(edge.from);
          const target = nodeMap.get(edge.to);
          
          if (!source || !target) return null;
          
          return (
            <g key={`edge-${i}`}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={edge.color || '#999'}
                strokeWidth={edge.weight || 1}
                opacity={0.6}
              />
              {showWeights && edge.weight && (
                <text
                  x={(source.x! + target.x!) / 2}
                  y={(source.y! + target.y!) / 2 - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Render nodes */}
        {layoutedNodes.map((node, i) => {
          const size = node.size || 20;
          const color = getNodeColor(node);
          
          return (
            <g key={`node-${i}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={size}
                fill={color}
                stroke="#333"
                strokeWidth={2}
              />
              {showLabels && (
                <text
                  x={node.x}
                  y={node.y! + size + 15}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill="#333"
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Legend */}
        {groups.length > 0 && (
          <g transform={`translate(10, 10)`}>
            <rect
              x={0}
              y={0}
              width={120}
              height={groups.length * 20 + 10}
              fill="white"
              stroke="#ddd"
              strokeWidth={1}
              rx={4}
              opacity={0.9}
            />
            {groups.map((group, i) => (
              <g key={`legend-${i}`} transform={`translate(5, ${i * 20 + 15})`}>
                <circle
                  cx={6}
                  cy={0}
                  r={6}
                  fill={colorPalette[i % colorPalette.length]}
                />
                <text
                  x={18}
                  y={4}
                  fontSize={10}
                  fill="#333"
                >
                  {group}
                </text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
