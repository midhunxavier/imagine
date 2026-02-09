/**
 * Engineering Components Demo - Flowcharts, networks, and system diagrams
 */

import { Flowchart, NetworkGraph, SankeyDiagram, SystemDiagram, sampleFlowcharts, sampleNetworks, sampleSankeyData, sampleSystemDiagrams } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

export default function EngineeringDemo(props: FigureComponentBaseProps & { variant?: string }) {
  const { variant = 'default', ...figureProps } = props;

  if (variant === 'flowchart') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <Flowchart
          nodes={sampleFlowcharts.process.nodes}
          edges={sampleFlowcharts.process.edges}
          width={figureProps.width}
          height={figureProps.height}
          showEdgeLabels
        />
      </svg>
    );
  }

  if (variant === 'network') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <NetworkGraph
          nodes={sampleNetworks.simple.nodes}
          edges={sampleNetworks.simple.edges}
          width={figureProps.width}
          height={figureProps.height}
          showLabels
          showWeights
        />
      </svg>
    );
  }

  if (variant === 'sankey') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <SankeyDiagram
          nodes={sampleSankeyData.energy.nodes}
          links={sampleSankeyData.energy.links}
          width={figureProps.width}
          height={figureProps.height}
          showValues
        />
      </svg>
    );
  }

  if (variant === 'system') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <SystemDiagram
          blocks={sampleSystemDiagrams.control.blocks}
          connections={sampleSystemDiagrams.control.connections}
          width={figureProps.width}
          height={figureProps.height}
          showLabels
        />
      </svg>
    );
  }

  // Default: Show all components in a grid
  return (
    <div style={{ 
      width: figureProps.width, 
      height: figureProps.height, 
      background: figureProps.background,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      padding: '20px'
    }}>
      <Flowchart 
        nodes={sampleFlowcharts.process.nodes}
        edges={sampleFlowcharts.process.edges}
        width={(figureProps.width - 60) / 2} 
        height={(figureProps.height - 60) / 2}
      />
      <NetworkGraph 
        nodes={sampleNetworks.simple.nodes}
        edges={sampleNetworks.simple.edges}
        width={(figureProps.width - 60) / 2} 
        height={(figureProps.height - 60) / 2}
      />
      <SankeyDiagram 
        nodes={sampleSankeyData.energy.nodes}
        links={sampleSankeyData.energy.links}
        width={(figureProps.width - 60) / 2} 
        height={(figureProps.height - 60) / 2}
      />
      <SystemDiagram 
        blocks={sampleSystemDiagrams.control.blocks}
        connections={sampleSystemDiagrams.control.connections}
        width={(figureProps.width - 60) / 2} 
        height={(figureProps.height - 60) / 2}
      />
    </div>
  );
}
