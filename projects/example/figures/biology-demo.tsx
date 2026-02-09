/**
 * Biology Components Demo - Phylogenetic trees, sequence logos, and more
 */

import { PhyloTree, SequenceLogo, generateSampleSequences } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

// Sample phylogenetic trees in Newick format
const sampleTrees = {
  simple: '((Human:0.1,Chimp:0.1):0.2,(Gorilla:0.15,Orangutan:0.2):0.15);',
  mammals: '(((Human:0.03,Chimp:0.03)95:0.05,Gorilla:0.08)88:0.05,(Orangutan:0.12,Gibbon:0.15)92:0.05);',
  vertebrates: '((((Human:0.03,Chimp:0.03):0.05,Gorilla:0.08):0.05,(Orangutan:0.12,Gibbon:0.15):0.05):0.1,((Mouse:0.2,Rat:0.22):0.1,(Dog:0.25,Cat:0.28):0.08):0.05);',
};

export default function BiologyDemo(props: FigureComponentBaseProps & { variant?: string }) {
  const { variant = 'default', ...figureProps } = props;

  if (variant === 'phylo-simple') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <PhyloTree
          data={sampleTrees.simple}
          width={figureProps.width}
          height={figureProps.height}
          layout="rectangular"
          showBranchLengths
          showBootstrap
          margin={{ top: 40, right: 150, bottom: 60, left: 40 }}
        />
      </svg>
    );
  }

  if (variant === 'phylo-vertebrates') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <PhyloTree
          data={sampleTrees.vertebrates}
          width={figureProps.width}
          height={figureProps.height}
          layout="rectangular"
          showBranchLengths
          showBootstrap
          highlightClades={['Human', 'Chimp']}
          margin={{ top: 40, right: 150, bottom: 60, left: 40 }}
        />
      </svg>
    );
  }

  if (variant === 'sequence-logo-dna') {
    const sequences = generateSampleSequences('DNA', 50, 40);
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <SequenceLogo
          sequences={sequences}
          type="DNA"
          width={figureProps.width}
          height={figureProps.height}
          showNumbers
          numberInterval={5}
          showYAxis
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        />
      </svg>
    );
  }

  if (variant === 'sequence-logo-protein') {
    const sequences = generateSampleSequences('PROTEIN', 30, 25);
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <SequenceLogo
          sequences={sequences}
          type="PROTEIN"
          width={figureProps.width}
          height={figureProps.height}
          showNumbers
          numberInterval={5}
          showYAxis
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        />
      </svg>
    );
  }

  // Default: phylogenetic tree with mammals
  return (
    <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
      <PhyloTree
        data={sampleTrees.mammals}
        width={figureProps.width}
        height={figureProps.height}
        layout="rectangular"
        showBranchLengths
        showBootstrap
        margin={{ top: 40, right: 150, bottom: 60, left: 40 }}
      />
    </svg>
  );
}
