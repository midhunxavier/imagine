/**
 * SequenceLogo Component - Display sequence conservation and motif patterns
 * Shows information content at each position using letter heights
 */

import { useMemo } from 'react';

export type SequenceType = 'DNA' | 'RNA' | 'PROTEIN';

export interface SequenceLogoProps {
  /** Array of sequences (must be aligned and same length) */
  sequences: string[];
  
  /** Type of sequences */
  type?: SequenceType;
  
  /** Width of the logo */
  width?: number;
  
  /** Height of the logo */
  height?: number;
  
  /** Show position numbers */
  showNumbers?: boolean;
  
  /** Number interval for position labels */
  numberInterval?: number;
  
  /** Starting position number */
  startPosition?: number;
  
  /** Color scheme */
  colorScheme?: 'standard' | 'chemistry' | 'hydrophobicity';
  
  /** Show Y-axis label */
  showYAxis?: boolean;
  
  /** Margin around the logo */
  margin?: { top: number; right: number; bottom: number; left: number };
}

// Standard color schemes
const colorSchemes = {
  DNA: {
    A: '#00C853', // Green
    C: '#FF3D00', // Red
    G: '#FFD600', // Yellow
    T: '#2962FF', // Blue
    U: '#2962FF'  // Blue (RNA)
  },
  PROTEIN: {
    A: '#00C853', G: '#00C853', S: '#00C853', T: '#00C853', // Polar
    C: '#FFD600', V: '#FFD600', I: '#FFD600', L: '#FFD600', P: '#FFD600', F: '#FFD600', Y: '#FFD600', M: '#FFD600', W: '#FFD600', // Hydrophobic
    N: '#FF3D00', Q: '#FF3D00', H: '#FF3D00', // Basic
    D: '#2962FF', E: '#2962FF', // Acidic
    K: '#AA00FF', R: '#AA00FF'  // Positive
  }
};

/**
 * Calculate letter frequencies at each position
 */
function calculateFrequencies(sequences: string[]): Map<string, number>[] {
  if (sequences.length === 0) return [];
  
  const seqLength = sequences[0].length;
  const frequencies: Map<string, number>[] = [];
  
  for (let pos = 0; pos < seqLength; pos++) {
    const freqMap = new Map<string, number>();
    
    for (const seq of sequences) {
      const char = seq[pos]?.toUpperCase() || '-';
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
    
    // Convert to probabilities
    for (const [char, count] of freqMap) {
      freqMap.set(char, count / sequences.length);
    }
    
    frequencies.push(freqMap);
  }
  
  return frequencies;
}

/**
 * Calculate information content (bits) for each position
 * Formula: I = log2(N) + sum(p_i * log2(p_i))
 * where N is alphabet size (4 for DNA, 20 for protein)
 */
function calculateInformationContent(
  frequencies: Map<string, number>[],
  alphabetSize: number
): number[] {
  return frequencies.map(freqMap => {
    let entropy = 0;
    for (const prob of freqMap.values()) {
      if (prob > 0) {
        entropy += prob * Math.log2(prob);
      }
    }
    return Math.log2(alphabetSize) + entropy;
  });
}

export function SequenceLogo({
  sequences,
  type = 'DNA',
  width = 800,
  height = 200,
  showNumbers = true,
  numberInterval = 5,
  startPosition = 1,
  colorScheme = 'standard',
  showYAxis = true,
  margin = { top: 20, right: 20, bottom: 40, left: 50 }
}: SequenceLogoProps) {
  const logoData = useMemo(() => {
    if (!sequences || sequences.length === 0) {
      return null;
    }
    
    const alphabetSize = type === 'PROTEIN' ? 20 : 4;
    const frequencies = calculateFrequencies(sequences);
    const infoContent = calculateInformationContent(frequencies, alphabetSize);
    
    return { frequencies, infoContent };
  }, [sequences, type]);
  
  if (!logoData) {
    return (
      <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
        No sequence data
      </text>
    );
  }
  
  const { frequencies, infoContent } = logoData;
  const seqLength = frequencies.length;
  const maxBits = type === 'PROTEIN' ? Math.log2(20) : 2;
  
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const colWidth = plotWidth / seqLength;
  
  // Get color for a character
  const getColor = (char: string) => {
    const scheme = type === 'PROTEIN' ? colorSchemes.PROTEIN : colorSchemes.DNA;
    return (scheme as any)[char] || '#999';
  };
  
  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Y-axis */}
      {showYAxis && (
        <g>
          <line x1={0} y1={0} x2={0} y2={plotHeight} stroke="#333" strokeWidth={1} />
          {[0, maxBits / 2, maxBits].map((tick, i) => (
            <g key={`y-tick-${i}`} transform={`translate(0, ${plotHeight - (tick / maxBits) * plotHeight})`}>
              <line x1={-5} y1={0} x2={0} y2={0} stroke="#333" strokeWidth={1} />
              <text x={-10} y={4} textAnchor="end" fontSize={12} fill="#333">
                {tick.toFixed(1)}
              </text>
            </g>
          ))}
          <text
            x={-35}
            y={plotHeight / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#333"
            transform={`rotate(-90, -35, ${plotHeight / 2})`}
          >
            Bits
          </text>
        </g>
      )}
      
      {/* Position numbers */}
      {showNumbers && (
        <g transform={`translate(0, ${plotHeight + 20})`}>
          {frequencies.map((_, pos) => {
            const position = startPosition + pos;
            if (position % numberInterval === 0 || pos === 0 || pos === seqLength - 1) {
              return (
                <text
                  key={`pos-${pos}`}
                  x={(pos + 0.5) * colWidth}
                  y={0}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#666"
                >
                  {position}
                </text>
              );
            }
            return null;
          })}
        </g>
      )}
      
      {/* Logo columns */}
      {frequencies.map((freqMap, pos) => {
        const info = infoContent[pos];
        const x = pos * colWidth;
        
        // Sort characters by frequency (descending)
        const sortedChars = Array.from(freqMap.entries())
          .sort((a, b) => b[1] - a[1])
          .filter(([char]) => char !== '-'); // Skip gaps
        
        let currentY = plotHeight;
        
        return (
          <g key={`col-${pos}`} transform={`translate(${x}, 0)`}>
            {sortedChars.map(([char, freq]) => {
              const letterHeight = (freq * info / maxBits) * plotHeight;
              const y = currentY - letterHeight;
              currentY = y;
              
              return (
                <text
                  key={`${pos}-${char}`}
                  x={colWidth / 2}
                  y={y + letterHeight}
                  textAnchor="middle"
                  fontSize={Math.max(8, colWidth * 0.8)}
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill={getColor(char)}
                  style={{ userSelect: 'none' }}
                >
                  {char}
                </text>
              );
            })}
          </g>
        );
      })}
      
      {/* X-axis line */}
      <line x1={0} y1={plotHeight} x2={plotWidth} y2={plotHeight} stroke="#333" strokeWidth={1} />
    </g>
  );
}

/**
 * Generate sample sequences for testing
 */
export function generateSampleSequences(
  type: SequenceType = 'DNA',
  count: number = 20,
  length: number = 30
): string[] {
  const dnaBases = ['A', 'C', 'G', 'T'];
  const rnaBases = ['A', 'C', 'G', 'U'];
  const aminoAcids = 'ACDEFGHIKLMNPQRSTVWY'.split('');
  
  const alphabet = type === 'DNA' ? dnaBases : type === 'RNA' ? rnaBases : aminoAcids;
  
  return Array.from({ length: count }, () => {
    return Array.from({ length }, () => {
      // Add some conservation bias
      const rand = Math.random();
      if (rand < 0.3) return alphabet[0]; // 30% chance of first base (conserved)
      if (rand < 0.5) return alphabet[1]; // 20% chance of second base
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    }).join('');
  });
}
