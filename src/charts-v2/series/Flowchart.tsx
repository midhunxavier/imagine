/**
 * Flowchart Component - Process flow diagram visualization
 */

import { useMemo } from 'react';
import { layoutFlowchart, type FlowNode, type FlowEdge } from '../utils/engineering';

export interface FlowchartProps {
  /** Flowchart nodes */
  nodes: FlowNode[];
  
  /** Flowchart edges/connections */
  edges: FlowEdge[];
  
  /** Width of the diagram */
  width?: number;
  
  /** Height of the diagram */
  height?: number;
  
  /** Node color */
  nodeColor?: string;
  
  /** Edge color */
  edgeColor?: string;
  
  /** Show edge labels */
  showEdgeLabels?: boolean;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin around diagram */
  margin?: number;
}

export function Flowchart({
  nodes,
  edges,
  width = 800,
  height = 400,
  nodeColor = '#2196F3',
  edgeColor = '#666',
  showEdgeLabels = true,
  backgroundColor = 'white',
  margin = 40
}: FlowchartProps) {
  // Layout nodes
  const layoutedNodes = useMemo(() => {
    return layoutFlowchart(nodes, edges, width - 2 * margin, height - 2 * margin);
  }, [nodes, edges, width, height, margin]);
  
  // Create node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, FlowNode>();
    layoutedNodes.forEach(node => map.set(node.id, node));
    return map;
  }, [layoutedNodes]);
  
  // Render edge path
  const renderEdge = (edge: FlowEdge, index: number) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    
    if (!fromNode || !toNode || !fromNode.x || !fromNode.y || !toNode.x || !toNode.y) {
      return null;
    }
    
    const fromX = fromNode.x + margin;
    const fromY = fromNode.y + margin;
    const toX = toNode.x + margin;
    const toY = toNode.y + margin;
    
    // Calculate connection points
    const fromWidth = fromNode.width || 120;
    const fromHeight = fromNode.height || 60;
    const toWidth = toNode.width || 120;
    const toHeight = toNode.height || 60;
    
    const startX = fromX + fromWidth / 2;
    const startY = fromY + fromHeight / 2;
    const endX = toX + toWidth / 2;
    const endY = toY + toHeight / 2;
    
    // Create path with arrow
    const dx = endX - startX;
    const dy = endY - startY;
    const angle = Math.atan2(dy, dx);
    
    // Shorten line to not overlap nodes
    const nodeRadius = 30;
    const startXAdj = startX + Math.cos(angle) * nodeRadius;
    const startYAdj = startY + Math.sin(angle) * nodeRadius;
    const endXAdj = endX - Math.cos(angle) * nodeRadius;
    const endYAdj = endY - Math.sin(angle) * nodeRadius;
    
    const path = `M ${startXAdj} ${startYAdj} L ${endXAdj} ${endYAdj}`;
    
    // Arrow head
    const arrowLength = 10;
    const arrowAngle = Math.PI / 6;
    const arrowX1 = endXAdj - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = endYAdj - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = endXAdj - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = endYAdj - arrowLength * Math.sin(angle + arrowAngle);
    
    const midX = (startXAdj + endXAdj) / 2;
    const midY = (startYAdj + endYAdj) / 2;
    
    return (
      <g key={`edge-${index}`}>
        <path
          d={path}
          stroke={edgeColor}
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <polygon
          points={`${endXAdj},${endYAdj} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
          fill={edgeColor}
        />
        {showEdgeLabels && edge.label && (
          <text
            x={midX}
            y={midY - 5}
            textAnchor="middle"
            fontSize={11}
            fill="#333"
            style={{ backgroundColor: 'white' }}
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };
  
  // Render node based on type
  const renderNode = (node: FlowNode, index: number) => {
    if (!node.x || !node.y) return null;
    
    const x = node.x + margin;
    const y = node.y + margin;
    const nodeWidth = node.width || 120;
    const nodeHeight = node.height || 60;
    
    let shape;
    switch (node.type) {
      case 'start':
      case 'end':
        // Ellipse for start/end
        shape = (
          <ellipse
            cx={x + nodeWidth / 2}
            cy={y + nodeHeight / 2}
            rx={nodeWidth / 2}
            ry={nodeHeight / 2}
            fill={nodeColor}
            stroke="#333"
            strokeWidth={2}
          />
        );
        break;
      case 'decision':
        // Diamond for decision
        const cx = x + nodeWidth / 2;
        const cy = y + nodeHeight / 2;
        shape = (
          <polygon
            points={`${cx},${y} ${x + nodeWidth},${cy} ${cx},${y + nodeHeight} ${x},${cy}`}
            fill="#FF9800"
            stroke="#333"
            strokeWidth={2}
          />
        );
        break;
      case 'io':
        // Parallelogram for I/O
        const offset = 20;
        shape = (
          <polygon
            points={`${x + offset},${y} ${x + nodeWidth},${y} ${x + nodeWidth - offset},${y + nodeHeight} ${x},${y + nodeHeight}`}
            fill="#9C27B0"
            stroke="#333"
            strokeWidth={2}
          />
        );
        break;
      default:
        // Rectangle for process
        shape = (
          <rect
            x={x}
            y={y}
            width={nodeWidth}
            height={nodeHeight}
            rx={4}
            fill={nodeColor}
            stroke="#333"
            strokeWidth={2}
          />
        );
    }
    
    return (
      <g key={`node-${index}`}>
        {shape}
        <text
          x={x + nodeWidth / 2}
          y={y + nodeHeight / 2 + 4}
          textAnchor="middle"
          fontSize={12}
          fontWeight="bold"
          fill="white"
        >
          {node.label}
        </text>
      </g>
    );
  };
  
  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill={edgeColor} />
        </marker>
      </defs>
      
      {/* Render edges first (behind nodes) */}
      {edges.map((edge, i) => renderEdge(edge, i))}
      
      {/* Render nodes */}
      {layoutedNodes.map((node, i) => renderNode(node, i))}
    </svg>
  );
}
