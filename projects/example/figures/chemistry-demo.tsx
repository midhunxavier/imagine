/**
 * Chemistry Components Demo - Molecular structures and spectroscopy
 */

import { Molecule, NMRSpectrum, IRSpectrum, MassSpectrum, sampleMolecules, sampleNMRSpectra, sampleIRSpectra, sampleMassSpectra } from '@/charts-v2';
import type { FigureComponentBaseProps } from '@/framework/types';

export default function ChemistryDemo(props: FigureComponentBaseProps & { variant?: string }) {
  const { variant = 'default', ...figureProps } = props;

  if (variant === 'molecules') {
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
        <Molecule 
          smiles={sampleMolecules.benzene} 
          width={figureProps.width / 2 - 30} 
          height={figureProps.height / 2 - 30}
          name="Benzene"
        />
        <Molecule 
          smiles={sampleMolecules.ethanol} 
          width={figureProps.width / 2 - 30} 
          height={figureProps.height / 2 - 30}
          name="Ethanol"
        />
        <Molecule 
          smiles={sampleMolecules.acetone} 
          width={figureProps.width / 2 - 30} 
          height={figureProps.height / 2 - 30}
          name="Acetone"
        />
        <Molecule 
          smiles={sampleMolecules.caffeine} 
          width={figureProps.width / 2 - 30} 
          height={figureProps.height / 2 - 30}
          name="Caffeine"
        />
      </div>
    );
  }

  if (variant === 'nmr-ethanol') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <NMRSpectrum
          data={sampleNMRSpectra.ethanol as any}
          width={figureProps.width}
          height={figureProps.height}
          showPeakLabels
          lineColor="#2196F3"
        />
      </svg>
    );
  }

  if (variant === 'nmr-toluene') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <NMRSpectrum
          data={sampleNMRSpectra.toluene as any}
          width={figureProps.width}
          height={figureProps.height}
          showPeakLabels
          lineColor="#9C27B0"
        />
      </svg>
    );
  }

  if (variant === 'ir-spectra') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <IRSpectrum
          data={sampleIRSpectra.ethanol as any}
          width={figureProps.width}
          height={figureProps.height}
          showPeakLabels
          showFunctionalGroups
          lineColor="#E91E63"
        />
      </svg>
    );
  }

  if (variant === 'mass-spec') {
    return (
      <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
        <MassSpectrum
          data={sampleMassSpectra.caffeine as any}
          width={figureProps.width}
          height={figureProps.height}
          showPeakLabels
          minIntensity={10}
        />
      </svg>
    );
  }

  // Default: Single molecule (Aspirin)
  return (
    <svg {...figureProps} viewBox={`0 0 ${figureProps.width} ${figureProps.height}`}>
      <foreignObject width={figureProps.width} height={figureProps.height}>
        <Molecule 
          smiles={sampleMolecules.aspirin} 
          width={figureProps.width} 
          height={figureProps.height}
          name="Aspirin (Acetylsalicylic Acid)"
          showLabels
        />
      </foreignObject>
    </svg>
  );
}
