/**
 * Engineering Utilities - Layout algorithms and helpers for diagrams
 */

export interface FlowNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  type?: 'start' | 'process' | 'decision' | 'end' | 'io';
  width?: number;
  height?: number;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  group?: string;
}

export interface NetworkEdge {
  from: string;
  to: string;
  weight?: number;
  color?: string;
}

export interface SankeyNode {
  id: string;
  label: string;
  value?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SystemBlock {
  id: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  inputs?: string[];
  outputs?: string[];
  color?: string;
}

/**
 * Simple layout algorithm for flowcharts
 */
export function layoutFlowchart(
  nodes: FlowNode[],
  edges: FlowEdge[],
  width: number,
  height: number
): FlowNode[] {
  const nodeWidth = 120;
  const nodeHeight = 60;
  const levelGap = 150;
  const nodeGap = 80;
  
  const levels: { [key: string]: number } = {};
  nodes.forEach(node => { levels[node.id] = 0; });
  
  let changed = true;
  while (changed) {
    changed = false;
    edges.forEach(edge => {
      if (levels[edge.from] + 1 > levels[edge.to]) {
        levels[edge.to] = levels[edge.from] + 1;
        changed = true;
      }
    });
  }
  
  const levelGroups: { [key: number]: string[] } = {};
  nodes.forEach(node => {
    const level = levels[node.id];
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(node.id);
  });
  
  const maxLevel = Math.max(...Object.values(levels));
  
  return nodes.map(node => {
    const level = levels[node.id];
    const nodesInLevel = levelGroups[level];
    const indexInLevel = nodesInLevel.indexOf(node.id);
    
    return {
      ...node,
      x: (width / (maxLevel + 1)) * (level + 0.5),
      y: (height / 2) + (indexInLevel - nodesInLevel.length / 2) * (nodeHeight + nodeGap),
      width: nodeWidth,
      height: nodeHeight
    };
  });
}

/**
 * Sample flowchart data
 */
export const sampleFlowcharts = {
  process: {
    nodes: [
      { id: 'start', label: 'Start', type: 'start' as const },
      { id: 'input', label: 'Input Data', type: 'io' as const },
      { id: 'process', label: 'Process', type: 'process' as const },
      { id: 'decision', label: 'Valid?', type: 'decision' as const },
      { id: 'output', label: 'Output Result', type: 'io' as const },
      { id: 'end', label: 'End', type: 'end' as const }
    ],
    edges: [
      { from: 'start', to: 'input' },
      { from: 'input', to: 'process' },
      { from: 'process', to: 'decision' },
      { from: 'decision', to: 'output', label: 'Yes' },
      { from: 'decision', to: 'input', label: 'No' },
      { from: 'output', to: 'end' }
    ]
  }
};

/**
 * Sample network data
 */
export const sampleNetworks = {
  simple: {
    nodes: [
      { id: 'A', label: 'Node A', size: 20, group: '1' },
      { id: 'B', label: 'Node B', size: 15, group: '1' },
      { id: 'C', label: 'Node C', size: 25, group: '2' },
      { id: 'D', label: 'Node D', size: 18, group: '2' },
      { id: 'E', label: 'Node E', size: 22, group: '3' }
    ],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 4 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'C', to: 'E', weight: 5 },
      { from: 'D', to: 'E', weight: 2 }
    ]
  }
};

/**
 * Sample Sankey data
 */
export const sampleSankeyData = {
  energy: {
    nodes: [
      { id: 'source1', label: 'Solar' },
      { id: 'source2', label: 'Wind' },
      { id: 'source3', label: 'Coal' },
      { id: 'grid', label: 'Power Grid' },
      { id: 'industry', label: 'Industry' },
      { id: 'residential', label: 'Residential' },
      { id: 'losses', label: 'Losses' }
    ],
    links: [
      { source: 'source1', target: 'grid', value: 30 },
      { source: 'source2', target: 'grid', value: 25 },
      { source: 'source3', target: 'grid', value: 45 },
      { source: 'grid', target: 'industry', value: 50 },
      { source: 'grid', target: 'residential', value: 35 },
      { source: 'grid', target: 'losses', value: 15 }
    ]
  }
};

/**
 * Sample system diagram data
 */
export const sampleSystemDiagrams = {
  control: {
    blocks: [
      { id: 'input', label: 'Input', x: 50, y: 150, width: 100, height: 60 },
      { id: 'controller', label: 'Controller', x: 250, y: 150, width: 120, height: 80 },
      { id: 'plant', label: 'Plant', x: 450, y: 150, width: 100, height: 60 },
      { id: 'output', label: 'Output', x: 650, y: 150, width: 100, height: 60 },
      { id: 'sensor', label: 'Sensor', x: 350, y: 300, width: 100, height: 60 }
    ],
    connections: [
      { from: 'input', to: 'controller' },
      { from: 'controller', to: 'plant' },
      { from: 'plant', to: 'output' },
      { from: 'output', to: 'sensor' },
      { from: 'sensor', to: 'controller', label: 'Feedback' }
    ]
  }
};
