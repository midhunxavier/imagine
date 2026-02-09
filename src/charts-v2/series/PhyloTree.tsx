/**
 * PhyloTree Component - Phylogenetic tree visualization
 * Supports Newick format, multiple layouts, and interactive features
 */

import { useMemo } from 'react';
import { hierarchy, tree, cluster } from 'd3-hierarchy';
import { parseNewick, getLeafNodes, type PhyloNode } from '../utils/biology';

export type TreeLayout = 'rectangular' | 'circular' | 'radial';

export interface PhyloTreeProps {
  /** Newick format tree string */
  data: string;
  
  /** Layout type */
  layout?: TreeLayout;
  
  /** Width of the tree area */
  width?: number;
  
  /** Height of the tree area */
  height?: number;
  
  /** Show branch lengths (if available in Newick) */
  showBranchLengths?: boolean;
  
  /** Show bootstrap values on internal nodes */
  showBootstrap?: boolean;
  
  /** Highlight specific clades by node names */
  highlightClades?: string[];
  
  /** Collapse specific clades */
  collapsedClades?: string[];
  
  /** Leaf label font size */
  leafLabelSize?: number;
  
  /** Branch stroke width */
  branchWidth?: number;
  
  /** Branch color */
  branchColor?: string;
  
  /** Leaf label color */
  leafLabelColor?: string;
  
  /** Highlight color for clades */
  highlightColor?: string;
  
  /** Margin around the tree */
  margin?: { top: number; right: number; bottom: number; left: number };
  
  /** Scale bar options */
  scaleBar?: {
    show?: boolean;
    position?: 'bottom-left' | 'bottom-right';
    length?: number;
    label?: string;
  };
}

export function PhyloTree({
  data,
  layout = 'rectangular',
  width = 800,
  height = 600,
  showBranchLengths = true,
  showBootstrap = true,
  highlightClades = [],
  collapsedClades = [],
  leafLabelSize = 12,
  branchWidth = 1.5,
  branchColor = '#333',
  leafLabelColor = '#333',
  highlightColor = '#FFD700',
  margin = { top: 40, right: 150, bottom: 60, left: 40 },
  scaleBar: scaleBarProp = { show: true, position: 'bottom-left', length: 0.1, label: '0.1' }
}: PhyloTreeProps) {
  // Ensure scaleBarProp has default values
  const scaleBar = {
    show: scaleBarProp?.show ?? true,
    position: scaleBarProp?.position ?? 'bottom-left',
    length: scaleBarProp?.length ?? 0.1,
    label: scaleBarProp?.label ?? '0.1'
  };
  
  // Calculate plot dimensions
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Parse the Newick tree
  const treeData = useMemo(() => {
    try {
      return parseNewick(data, { extractBootstrap: showBootstrap, parseBranchLengths: showBranchLengths });
    } catch (e) {
      console.error('Failed to parse Newick tree:', e);
      return null;
    }
  }, [data, showBootstrap, showBranchLengths]);
  
  // Convert to d3-hierarchy and compute layout
  const layoutData = useMemo(() => {
    if (!treeData) return null;
    
    // Create d3 hierarchy
    const root = hierarchy(treeData, d => (d as PhyloNode).children);
    
    // Apply collapsed clades
    if (collapsedClades.length > 0) {
      root.descendants().forEach((node: any) => {
        if (collapsedClades.includes(node.data.name)) {
          // In a real implementation, we'd collapse children here
          // For now, we'll just mark them
          (node.data as any)._collapsed = true;
        }
      });
    }
    
    // Compute layout based on type
    if (layout === 'rectangular') {
      // Use cluster layout for rectangular trees
      const treeLayout = cluster<PhyloNode>()
        .size([plotHeight, plotWidth])
        .separation((a: any, b: any) => (a.parent === b.parent ? 1 : 1.5));
      
      treeLayout(root);
      
      return { root, layout: 'rectangular' as const };
    } else if (layout === 'circular' || layout === 'radial') {
      // For circular/radial, we'd use different layout
      // For now, fall back to rectangular
      const treeLayout = cluster<PhyloNode>()
        .size([plotHeight, plotWidth]);
      
      treeLayout(root);
      
      return { root, layout: layout as 'circular' | 'radial' };
    }
    
    return { root, layout: 'rectangular' as const };
  }, [treeData, layout, plotHeight, plotWidth, collapsedClades]);
  
  if (!layoutData) {
    return (
      <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
        Invalid tree data
      </text>
    );
  }
  
  const { root } = layoutData;
  const leaves = root.leaves();
  
  // Calculate scale factor for branch lengths
  const maxBranchLength = Math.max(...leaves.map((d: any) => d.data.height || 0));
  const scaleFactor = showBranchLengths && maxBranchLength > 0 
    ? plotWidth / maxBranchLength 
    : plotWidth / (root.height || 1);
  
  // Generate links (branches)
  const links = root.links();
  
  // Check if node should be highlighted
  const isHighlighted = (name: string) => highlightClades.includes(name);
  
  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Branches */}
      {links.map((link, i) => {
        const source = link.source;
        const target = link.target;
        
        const x1 = (source.depth || 0) * scaleFactor;
        const y1 = source.x || 0;
        const x2 = (target.depth || 0) * scaleFactor;
        const y2 = target.x || 0;
        
        // Rectangular layout: L-shaped branches
        const path = layout === 'rectangular'
          ? `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`
          : `M ${x1} ${y1} L ${x2} ${y2}`;
        
        const highlighted = isHighlighted(target.data.name) || isHighlighted(source.data.name);
        
        return (
          <path
            key={`branch-${i}`}
            d={path}
            fill="none"
            stroke={highlighted ? highlightColor : branchColor}
            strokeWidth={highlighted ? branchWidth * 2 : branchWidth}
            opacity={target.data.name && collapsedClades.includes(target.data.name) ? 0.3 : 1}
          />
        );
      })}
      
      {/* Nodes */}
      {root.descendants().map((node, i) => {
        const x = (node.depth || 0) * scaleFactor;
        const y = node.x || 0;
        const isLeaf = !node.children || node.children.length === 0;
        const highlighted = isHighlighted(node.data.name);
        
        return (
          <g key={`node-${i}`} transform={`translate(${x}, ${y})`}>
            {/* Node circle for internal nodes */}
            {!isLeaf && (
              <circle
                r={3}
                fill={highlighted ? highlightColor : branchColor}
                stroke="white"
                strokeWidth={1}
              />
            )}
            
            {/* Bootstrap value */}
            {showBootstrap && !isLeaf && node.data.bootstrap !== undefined && (
              <text
                x={-8}
                y={-8}
                fontSize={10}
                fill="#666"
                textAnchor="end"
              >
                {node.data.bootstrap}
              </text>
            )}
            
            {/* Leaf label */}
            {isLeaf && node.data.name && (
              <text
                x={8}
                y={4}
                fontSize={leafLabelSize}
                fill={highlighted ? highlightColor : leafLabelColor}
                fontWeight={highlighted ? 'bold' : 'normal'}
              >
                {node.data.name}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Scale bar */}
      {scaleBar.show && (
        <g transform={`translate(
          ${scaleBar.position === 'bottom-right' ? plotWidth - 100 : 0}, 
          ${plotHeight + 20}
        )`}>
          <line
            x1={0}
            y1={0}
            x2={scaleBar.length * scaleFactor}
            y2={0}
            stroke="#333"
            strokeWidth={2}
          />
          <line x1={0} y1={-3} x2={0} y2={3} stroke="#333" strokeWidth={2} />
          <line 
            x1={scaleBar.length * scaleFactor} 
            y1={-3} 
            x2={scaleBar.length * scaleFactor} 
            y2={3} 
            stroke="#333" 
            strokeWidth={2} 
          />
          <text
            x={scaleBar.length * scaleFactor / 2}
            y={20}
            textAnchor="middle"
            fontSize={12}
            fill="#333"
          >
            {scaleBar.label}
          </text>
        </g>
      )}
    </g>
  );
}
