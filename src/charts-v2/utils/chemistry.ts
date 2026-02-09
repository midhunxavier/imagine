/**
 * Chemistry Utilities - Spectra parsing and helper functions
 */

// NMR Spectrum Types
export interface NMRPeak {
  chemicalShift: number; // ppm
  intensity: number;
  multiplicity?: 's' | 'd' | 't' | 'q' | 'm' | 'br';
  coupling?: number; // J value in Hz
  integration?: number;
  label?: string;
}

export interface NMRSpectrum {
  nuclei: '1H' | '13C' | '19F' | '31P';
  solvent?: string;
  frequency?: number; // MHz
  peaks: NMRPeak[];
  xDomain: [number, number]; // ppm range
}

// IR Spectrum Types
export interface IRPeak {
  wavenumber: number; // cm^-1
  transmittance: number; // 0-100%
  intensity: 'strong' | 'medium' | 'weak' | 'broad';
  functionalGroup?: string;
}

export interface IRSpectrum {
  peaks: IRPeak[];
  xDomain: [number, number]; // cm^-1 range
}

// Mass Spectrum Types
export interface MassPeak {
  mz: number; // mass-to-charge ratio
  intensity: number; // relative intensity
  label?: string;
  isBasePeak?: boolean;
}

export interface MassSpectrum {
  ionization: 'EI' | 'ESI' | 'MALDI' | 'CI';
  peaks: MassPeak[];
  molecularIon?: number;
  xDomain: [number, number];
}

/**
 * Parse NMR data from various formats
 */
export function parseNMRData(data: string): NMRSpectrum {
  // Simple format: "shift intensity [multiplicity coupling integration]"
  const lines = data.trim().split('\n');
  const peaks: NMRPeak[] = [];
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      const peak: NMRPeak = {
        chemicalShift: parseFloat(parts[0]),
        intensity: parseFloat(parts[1])
      };
      
      if (parts[2]) {
        peak.multiplicity = parts[2] as NMRPeak['multiplicity'];
      }
      if (parts[3]) {
        peak.coupling = parseFloat(parts[3]);
      }
      if (parts[4]) {
        peak.integration = parseFloat(parts[4]);
      }
      
      peaks.push(peak);
    }
  }
  
  // Calculate domain from peaks
  const shifts = peaks.map(p => p.chemicalShift);
  const minShift = Math.min(...shifts);
  const maxShift = Math.max(...shifts);
  const padding = (maxShift - minShift) * 0.1;
  
  return {
    nuclei: '1H',
    peaks,
    xDomain: [minShift - padding, maxShift + padding]
  };
}

/**
 * Parse IR data
 */
export function parseIRData(data: string): IRSpectrum {
  const lines = data.trim().split('\n');
  const peaks: IRPeak[] = [];
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      peaks.push({
        wavenumber: parseFloat(parts[0]),
        transmittance: parseFloat(parts[1]),
        intensity: (parts[2] as IRPeak['intensity']) || 'medium',
        functionalGroup: parts[3]
      });
    }
  }
  
  const wavenumbers = peaks.map(p => p.wavenumber);
  
  return {
    peaks,
    xDomain: [Math.min(...wavenumbers) - 100, Math.max(...wavenumbers) + 100]
  };
}

/**
 * Parse Mass Spec data
 */
export function parseMassSpecData(data: string): MassSpectrum {
  const lines = data.trim().split('\n');
  const peaks: MassPeak[] = [];
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      peaks.push({
        mz: parseFloat(parts[0]),
        intensity: parseFloat(parts[1]),
        label: parts[2],
        isBasePeak: parts[3] === 'base'
      });
    }
  }
  
  // Normalize intensities to 0-100
  const maxIntensity = Math.max(...peaks.map(p => p.intensity));
  peaks.forEach(p => {
    p.intensity = (p.intensity / maxIntensity) * 100;
  });
  
  const mzValues = peaks.map(p => p.mz);
  
  return {
    ionization: 'EI',
    peaks: peaks.sort((a, b) => a.mz - b.mz),
    xDomain: [0, Math.max(...mzValues) + 50]
  };
}

/**
 * Generate Lorentzian lineshape for NMR
 */
export function lorentzian(x: number, x0: number, gamma: number): number {
  return (gamma ** 2) / ((x - x0) ** 2 + gamma ** 2);
}

/**
 * Generate Gaussian lineshape for mass spec
 */
export function gaussian(x: number, x0: number, sigma: number): number {
  return Math.exp(-((x - x0) ** 2) / (2 * sigma ** 2));
}

/**
 * Sample NMR Spectra
 */
export const sampleNMRSpectra = {
  ethanol: {
    nuclei: '1H' as const,
    solvent: 'CDCl3',
    frequency: 400,
    peaks: [
      { chemicalShift: 1.22, intensity: 100, multiplicity: 't', coupling: 7.0, integration: 3, label: 'CH3' },
      { chemicalShift: 3.71, intensity: 80, multiplicity: 'q', coupling: 7.0, integration: 2, label: 'CH2' },
      { chemicalShift: 2.61, intensity: 30, multiplicity: 'br', integration: 1, label: 'OH' }
    ],
    xDomain: [0, 5]
  },
  
  acetone: {
    nuclei: '1H' as const,
    solvent: 'CDCl3',
    frequency: 400,
    peaks: [
      { chemicalShift: 2.17, intensity: 100, multiplicity: 's', integration: 6, label: 'CH3' }
    ],
    xDomain: [0, 5]
  },
  
  toluene: {
    nuclei: '1H' as const,
    solvent: 'CDCl3',
    frequency: 400,
    peaks: [
      { chemicalShift: 2.34, intensity: 100, multiplicity: 's', integration: 3, label: 'CH3' },
      { chemicalShift: 7.16, intensity: 60, multiplicity: 'd', coupling: 7.5, integration: 2, label: 'Ar-H' },
      { chemicalShift: 7.25, intensity: 70, multiplicity: 't', coupling: 7.5, integration: 1, label: 'Ar-H' },
      { chemicalShift: 7.12, intensity: 60, multiplicity: 'd', coupling: 7.5, integration: 2, label: 'Ar-H' }
    ],
    xDomain: [0, 8]
  }
};

/**
 * Sample IR Spectra
 */
export const sampleIRSpectra = {
  ethanol: {
    peaks: [
      { wavenumber: 3350, transmittance: 20, intensity: 'broad', functionalGroup: 'O-H stretch' },
      { wavenumber: 2970, transmittance: 40, intensity: 'medium', functionalGroup: 'C-H stretch' },
      { wavenumber: 1450, transmittance: 50, intensity: 'medium', functionalGroup: 'C-H bend' },
      { wavenumber: 1050, transmittance: 30, intensity: 'strong', functionalGroup: 'C-O stretch' }
    ],
    xDomain: [4000, 500]
  },
  
  acetone: {
    peaks: [
      { wavenumber: 1715, transmittance: 10, intensity: 'strong', functionalGroup: 'C=O stretch' },
      { wavenumber: 3000, transmittance: 60, intensity: 'medium', functionalGroup: 'C-H stretch' },
      { wavenumber: 1360, transmittance: 40, intensity: 'medium', functionalGroup: 'CH3 bend' }
    ],
    xDomain: [4000, 500]
  }
};

/**
 * Sample Mass Spectra
 */
export const sampleMassSpectra = {
  ethanol: {
    ionization: 'EI' as const,
    peaks: [
      { mz: 15, intensity: 20, label: 'CH3+' },
      { mz: 29, intensity: 40, label: 'CHO+' },
      { mz: 31, intensity: 100, isBasePeak: true, label: 'CH2OH+' },
      { mz: 45, intensity: 60, label: 'CH3CHOH+' },
      { mz: 46, intensity: 30, label: 'M+' }
    ],
    molecularIon: 46,
    xDomain: [0, 60]
  },
  
  caffeine: {
    ionization: 'EI' as const,
    peaks: [
      { mz: 55, intensity: 20 },
      { mz: 67, intensity: 25 },
      { mz: 82, intensity: 40 },
      { mz: 109, intensity: 50 },
      { mz: 194, intensity: 100, isBasePeak: true, label: 'M+' }
    ],
    molecularIon: 194,
    xDomain: [0, 210]
  }
};

/**
 * Common functional groups for IR
 */
export const commonFunctionalGroups: { [key: string]: { range: [number, number]; color: string } } = {
  'O-H (alcohol)': { range: [3200, 3600], color: '#2196F3' },
  'O-H (acid)': { range: [2500, 3300], color: '#1976D2' },
  'N-H': { range: [3300, 3500], color: '#9C27B0' },
  'C-H': { range: [2850, 3000], color: '#4CAF50' },
  'C≡N': { range: [2220, 2260], color: '#FF5722' },
  'C≡C': { range: [2100, 2260], color: '#795548' },
  'C=O': { range: [1650, 1750], color: '#F44336' },
  'C=C': { range: [1620, 1680], color: '#FF9800' },
  'C-O': { range: [1000, 1300], color: '#00BCD4' },
  'C-N': { range: [1020, 1220], color: '#E91E63' }
};
