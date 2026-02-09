/**
 * ContourPlot Component - 2D scalar field visualization with contour lines
 * Implements basic Marching Squares algorithm
 */

import React, { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';

export interface ContourPlotProps {
  /** Scalar field data (grid of values) */
  data: { x: number; y: number; value: number }[];
  
  /** Width of the plot */
  width?: number;
  
  /** Height of the plot */
  height?: number;
  
  /** Contour levels (values at which to draw lines) */
  thresholds?: number[];
  
  /** Number of auto-generated levels if thresholds not provided */
  numLevels?: number;
  
  /** Color scale (array of colors for levels) */
  colors?: string[];
  
  /** Show filled contours */
  filled?: boolean;
  
  /** Stroke width for contour lines */
  strokeWidth?: number;
  
  /** Show grid points (debug) */
  showPoints?: boolean;
  
  /** Margin */
  margin?: { top: number; right: number; bottom: number; left: number };
  
  /** Title */
  title?: string;
}

// Basic Marching Squares implementation
function generateContours(
  grid: number[][],
  width: number,
  height: number,
  thresholds: number[]
): { value: number; path: string }[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const cellWidth = width / (cols - 1);
  const cellHeight = height / (rows - 1);
  
  const contours: { value: number; path: string }[] = [];
  
  thresholds.forEach(threshold => {
    let pathD = '';
    
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        // Get values at corners of the cell
        // v0 --- v1
        // |       |
        // v3 --- v2
        const v0 = grid[i][j];
        const v1 = grid[i][j + 1];
        const v2 = grid[i + 1][j + 1];
        const v3 = grid[i + 1][j];
        
        // Determine binary index
        let index = 0;
        if (v0 >= threshold) index |= 8;
        if (v1 >= threshold) index |= 4;
        if (v2 >= threshold) index |= 2;
        if (v3 >= threshold) index |= 1;
        
        if (index === 0 || index === 15) continue; // All below or all above
        
        // Interpolation weights (0 to 1)
        // Top edge: between (j) and (j+1)
        const t0 = (threshold - v0) / (v1 - v0);
        // Right edge: between (i) and (i+1)
        const t1 = (threshold - v1) / (v2 - v1);
        // Bottom edge: between (j+1) and (j)
        const t2 = (threshold - v3) / (v2 - v3); // Note direction
        // Left edge: between (i+1) and (i)
        const t3 = (threshold - v0) / (v3 - v0);
        
        // Coordinates relative to cell origin (j, i)
        // x corresponds to j (col), y corresponds to i (row)
        const x = j * cellWidth;
        const y = i * cellHeight;
        
        // Line segments based on case
        // We just append simple lines for this implementation
        // A full implementation would stitch them into continuous paths
        
        const top = { x: x + t0 * cellWidth, y: y };
        const right = { x: x + cellWidth, y: y + t1 * cellHeight };
        const bottom = { x: x + (1 - t2) * cellWidth, y: y + cellHeight }; // Corrected t2 usage
        // Actually, t2 is fraction from v3 to v2. x = x + t2*cellWidth is easier?
        // Let's stick to standard marching squares tables.
        
        // Re-deriving geometric points:
        // Top: (j + t0, i)
        // Right: (j + 1, i + t1)
        // Bottom: (j + t2, i + 1) -- wait, standard is usually (j + (1-t2), i+1)? 
        // Let's use simple linear interpolation:
        // pTop = (j + (threshold-v0)/(v1-v0), i)
        // pRight = (j + 1, i + (threshold-v1)/(v2-v1))
        // pBottom = (j + (threshold-v3)/(v2-v3), i + 1) -- assuming left-to-right on bottom
        // pLeft = (j, i + (threshold-v0)/(v3-v0))
        
        const ptTop = { x: x + (threshold - v0) / (v1 - v0) * cellWidth, y: y };
        const ptRight = { x: x + cellWidth, y: y + (threshold - v1) / (v2 - v1) * cellHeight };
        const ptBottom = { x: x + (threshold - v3) / (v2 - v3) * cellWidth, y: y + cellHeight };
        const ptLeft = { x: x, y: y + (threshold - v0) / (v3 - v0) * cellHeight };
        
        const drawLine = (p1: {x:number, y:number}, p2: {x:number, y:number}) => {
          pathD += `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `;
        };
        
        switch (index) {
          case 1: drawLine(ptLeft, ptBottom); break;
          case 2: drawLine(ptBottom, ptRight); break;
          case 3: drawLine(ptLeft, ptRight); break;
          case 4: drawLine(ptTop, ptRight); break;
          case 5: drawLine(ptLeft, ptTop); drawLine(ptBottom, ptRight); break; // Ambiguous
          case 6: drawLine(ptTop, ptBottom); break;
          case 7: drawLine(ptLeft, ptTop); break;
          case 8: drawLine(ptLeft, ptTop); break;
          case 9: drawLine(ptTop, ptBottom); break;
          case 10: drawLine(ptTop, ptRight); drawLine(ptBottom, ptLeft); break; // Ambiguous
          case 11: drawLine(ptTop, ptRight); break;
          case 12: drawLine(ptLeft, ptRight); break;
          case 13: drawLine(ptBottom, ptRight); break;
          case 14: drawLine(ptLeft, ptBottom); break;
        }
      }
    }
    
    contours.push({ value: threshold, path: pathD });
  });
  
  return contours;
}

export function ContourPlot({
  data,
  width = 600,
  height = 400,
  thresholds,
  numLevels = 10,
  colors = ['#f7fbff', '#08306b'], // Light blue to dark blue
  filled = false,
  strokeWidth = 1.5,
  showPoints = false,
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  title
}: ContourPlotProps) {
  // Process data into grid
  const processedData = useMemo(() => {
    if (!data.length) return { grid: [], xDomain: [0, 1], yDomain: [0, 1], min: 0, max: 0 };
    
    // Find unique x and y values to determine grid dimensions
    const xValues = Array.from(new Set(data.map(d => d.x))).sort((a, b) => a - b);
    const yValues = Array.from(new Set(data.map(d => d.y))).sort((a, b) => a - b);
    
    const rows = yValues.length;
    const cols = xValues.length;
    const grid: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
    
    let min = Infinity;
    let max = -Infinity;
    
    data.forEach(d => {
      const col = xValues.indexOf(d.x);
      const row = yValues.indexOf(d.y);
      if (col >= 0 && row >= 0) {
        grid[row][col] = d.value;
        min = Math.min(min, d.value);
        max = Math.max(max, d.value);
      }
    });
    
    return { 
      grid, 
      xDomain: [xValues[0], xValues[xValues.length - 1]], 
      yDomain: [yValues[0], yValues[yValues.length - 1]],
      min,
      max
    };
  }, [data]);
  
  const { grid, min, max } = processedData;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // Calculate thresholds
  const computedThresholds = useMemo(() => {
    if (thresholds) return thresholds;
    
    const result: number[] = [];
    const step = (max - min) / (numLevels + 1);
    for (let i = 1; i <= numLevels; i++) {
      result.push(min + i * step);
    }
    return result;
  }, [thresholds, numLevels, min, max]);
  
  // Calculate contours
  const contours = useMemo(() => {
    if (!grid.length) return [];
    return generateContours(grid, plotWidth, plotHeight, computedThresholds);
  }, [grid, plotWidth, plotHeight, computedThresholds]);
  
  // Color scale
  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain([min, max])
      .range(colors);
  }, [min, max, colors]);
  
  return (
    <svg width={width} height={height} style={{ backgroundColor: 'white' }}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Title */}
        {title && (
          <text
            x={plotWidth / 2}
            y={-20}
            textAnchor="middle"
            fontSize={16}
            fontWeight="bold"
            fill="#333"
          >
            {title}
          </text>
        )}
        
        {/* Grid Points (Debug) */}
        {showPoints && data.map((d, i) => {
          const x = ((d.x - processedData.xDomain[0]) / (processedData.xDomain[1] - processedData.xDomain[0])) * plotWidth;
          const y = ((d.y - processedData.yDomain[0]) / (processedData.yDomain[1] - processedData.yDomain[0])) * plotHeight;
          return (
            <circle key={i} cx={x} cy={y} r={1} fill="#ccc" />
          );
        })}
        
        {/* Contours */}
        {contours.map((contour, i) => (
          <path
            key={i}
            d={contour.path}
            fill="none"
            stroke={colorScale(contour.value)}
            strokeWidth={strokeWidth}
          />
        ))}
        
        {/* Border */}
        <rect
          x={0}
          y={0}
          width={plotWidth}
          height={plotHeight}
          fill="none"
          stroke="#333"
          strokeWidth={1}
        />
        
        {/* Legend */}
        <g transform={`translate(${plotWidth + 10}, 0)`}>
          <text x={0} y={-5} fontSize={10} fill="#666">Value</text>
          {computedThresholds.map((t, i) => (
            <g key={i} transform={`translate(0, ${i * 15})`}>
              <rect width={10} height={10} fill={colorScale(t)} />
              <text x={15} y={9} fontSize={10} fill="#666">{t.toFixed(1)}</text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
