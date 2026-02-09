/**
 * Molecule Component - Chemical structure visualization from SMILES
 * Simplified SVG-based renderer for common molecular structures
 */

import { useMemo } from 'react';

export interface MoleculeProps {
  /** SMILES string representation of molecule */
  smiles: string;
  
  /** Width of the molecule display */
  width?: number;
  
  /** Height of the molecule display */
  height?: number;
  
  /** Show atom labels */
  showLabels?: boolean;
  
  /** Atom label font size */
  labelSize?: number;
  
  /** Bond stroke width */
  bondWidth?: number;
  
  /** Carbon color */
  carbonColor?: string;
  
  /** Oxygen color */
  oxygenColor?: string;
  
  /** Nitrogen color */
  nitrogenColor?: string;
  
  /** Hydrogen color */
  hydrogenColor?: string;
  
  /** Sulfur color */
  sulfurColor?: string;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Margin around molecule */
  margin?: number;
  
  /** Molecule name/label */
  name?: string;
}

// Simple atom colors
const atomColors: { [key: string]: string } = {
  C: '#333333',
  O: '#FF0000',
  N: '#0000FF',
  H: '#888888',
  S: '#FFD700',
  Cl: '#00FF00',
  Br: '#8B4513',
  F: '#00FFFF',
  P: '#FF6600'
};

// Atom radii (in SVG units)
const atomRadii: { [key: string]: number } = {
  C: 15,
  O: 14,
  N: 14,
  H: 8,
  S: 18,
  Cl: 16,
  Br: 18,
  F: 12,
  P: 17
};

interface Atom {
  id: string;
  element: string;
  x: number;
  y: number;
  implicitH?: number;
}

interface Bond {
  from: string;
  to: string;
  type: 'single' | 'double' | 'triple' | 'aromatic';
}

/**
 * Parse simple SMILES to atom/bond structure
 * This is a simplified parser for demonstration
 */
function parseSMILES(smiles: string): { atoms: Atom[]; bonds: Bond[] } {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  
  let x = 0;
  let y = 0;
  let angle = 0;
  const bondLength = 40;
  const atomStack: string[] = [];
  let ringClosures: { [key: string]: string } = {};
  
  let i = 0;
  while (i < smiles.length) {
    const char = smiles[i];
    
    // Handle organic subset atoms
    if (/[CNOFPSIBrCl]/.test(char)) {
      let element = char;
      
      // Handle two-character elements
      if (i + 1 < smiles.length && /[lr]/.test(smiles[i + 1])) {
        element = char + smiles[i + 1];
        i++;
      }
      
      const atom: Atom = {
        id: `atom-${atoms.length}`,
        element,
        x,
        y
      };
      
      atoms.push(atom);
      
      // Connect to previous atom if available
      if (atomStack.length > 0) {
        bonds.push({
          from: atomStack[atomStack.length - 1],
          to: atom.id,
          type: 'single'
        });
      }
      
      atomStack.push(atom.id);
      
      // Move to next position
      x += bondLength * Math.cos(angle);
      y += bondLength * Math.sin(angle);
      angle += Math.PI / 3; // 60 degree turns for zigzag
    }
    
    // Handle bonds
    else if (char === '=') {
      if (bonds.length > 0) {
        bonds[bonds.length - 1].type = 'double';
      }
    }
    else if (char === '#') {
      if (bonds.length > 0) {
        bonds[bonds.length - 1].type = 'triple';
      }
    }
    
    // Handle branches
    else if (char === '(') {
      // Save current position
      // Simplified - doesn't handle complex branching
    }
    else if (char === ')') {
      // Restore position
      if (atomStack.length > 1) {
        atomStack.pop();
        const lastAtom = atoms.find(a => a.id === atomStack[atomStack.length - 1]);
        if (lastAtom) {
          x = lastAtom.x;
          y = lastAtom.y;
        }
      }
    }
    
    // Handle ring closures (digits)
    else if (/\d/.test(char)) {
      if (ringClosures[char]) {
        // Close ring
        bonds.push({
          from: ringClosures[char],
          to: atomStack[atomStack.length - 1],
          type: 'single'
        });
        delete ringClosures[char];
      } else {
        // Start ring
        ringClosures[char] = atomStack[atomStack.length - 1];
      }
    }
    
    i++;
  }
  
  // Center the molecule
  if (atoms.length > 0) {
    const minX = Math.min(...atoms.map(a => a.x));
    const maxX = Math.max(...atoms.map(a => a.x));
    const minY = Math.min(...atoms.map(a => a.y));
    const maxY = Math.max(...atoms.map(a => a.y));
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    atoms.forEach(atom => {
      atom.x -= centerX;
      atom.y -= centerY;
    });
  }
  
  return { atoms, bonds };
}

export function Molecule({
  smiles,
  width = 400,
  height = 300,
  showLabels = true,
  labelSize = 12,
  bondWidth = 2,
  backgroundColor = 'white',
  margin = 40,
  name
}: MoleculeProps) {
  const { atoms, bonds } = useMemo(() => {
    try {
      return parseSMILES(smiles);
    } catch (e) {
      console.error('Failed to parse SMILES:', e);
      return { atoms: [], bonds: [] };
    }
  }, [smiles]);
  
  if (atoms.length === 0) {
    return (
      <svg width={width} height={height} style={{ backgroundColor }}>
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
          Invalid SMILES: {smiles}
        </text>
      </svg>
    );
  }
  
  // Calculate bounds and scale
  const bounds = useMemo(() => {
    const xs = atoms.map(a => a.x);
    const ys = atoms.map(a => a.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const molWidth = maxX - minX + 60; // Add padding for atom radii
    const molHeight = maxY - minY + 60;
    
    const scaleX = (width - 2 * margin) / molWidth;
    const scaleY = (height - 2 * margin) / molHeight;
    const scale = Math.min(scaleX, scaleY);
    
    const offsetX = width / 2;
    const offsetY = height / 2;
    
    return { scale, offsetX, offsetY };
  }, [atoms, width, height, margin]);
  
  const { scale, offsetX, offsetY } = bounds;
  
  // Transform coordinates
  const transform = (x: number, y: number) => ({
    x: offsetX + x * scale,
    y: offsetY + y * scale
  });
  
  // Render bonds
  const renderBond = (bond: Bond, i: number) => {
    const fromAtom = atoms.find(a => a.id === bond.from);
    const toAtom = atoms.find(a => a.id === bond.to);
    
    if (!fromAtom || !toAtom) return null;
    
    const from = transform(fromAtom.x, fromAtom.y);
    const to = transform(toAtom.x, toAtom.y);
    
    if (bond.type === 'single') {
      return (
        <line
          key={`bond-${i}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="#333"
          strokeWidth={bondWidth}
        />
      );
    } else if (bond.type === 'double') {
      // Offset for double bond
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const offset = 3;
      const ox = (-dy / len) * offset;
      const oy = (dx / len) * offset;
      
      return (
        <g key={`bond-${i}`}>
          <line
            x1={from.x + ox}
            y1={from.y + oy}
            x2={to.x + ox}
            y2={to.y + oy}
            stroke="#333"
            strokeWidth={bondWidth}
          />
          <line
            x1={from.x - ox}
            y1={from.y - oy}
            x2={to.x - ox}
            y2={to.y - oy}
            stroke="#333"
            strokeWidth={bondWidth}
          />
        </g>
      );
    }
    
    return null;
  };
  
  return (
    <svg width={width} height={height} style={{ backgroundColor }}>
      {/* Molecule name */}
      {name && (
        <text
          x={width / 2}
          y={20}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill="#333"
        >
          {name}
        </text>
      )}
      
      {/* Bonds */}
      {bonds.map((bond, i) => renderBond(bond, i))}
      
      {/* Atoms */}
      {atoms.map((atom, i) => {
        const pos = transform(atom.x, atom.y);
        const radius = (atomRadii[atom.element] || 15) * (scale / 40);
        const color = atomColors[atom.element] || '#666';
        
        // Don't show carbon atoms explicitly (standard convention)
        const showAtom = atom.element !== 'C' || showLabels;
        
        return (
          <g key={`atom-${i}`}>
            {showAtom && (
              <>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill="white"
                  stroke={color}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize={Math.max(10, radius * 0.8)}
                  fontWeight="bold"
                  fill={color}
                >
                  {atom.element}
                </text>
              </>
            )}
          </g>
        );
      })}
      
      {/* SMILES label */}
      <text
        x={width / 2}
        y={height - 10}
        textAnchor="middle"
        fontSize={10}
        fill="#666"
        fontFamily="monospace"
      >
        {smiles}
      </text>
    </svg>
  );
}

/**
 * Sample SMILES strings for common molecules
 */
export const sampleMolecules = {
  water: 'O',
  methane: 'C',
  ethanol: 'CCO',
  benzene: 'c1ccccc1',
  acetone: 'CC(=O)C',
  aspirin: 'CC(=O)Oc1ccccc1C(=O)O',
  caffeine: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
  glucose: 'C(C1C(C(C(C(O1)O)O)O)O)O',
  cholesterol: 'CC(C)CCCC(C)C1CCC2C1(CCC3C2CC=C4C3(CCC(C4)O)C)C'
};
