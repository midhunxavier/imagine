/**
 * Heatmap Component - 2D matrix visualization with color encoding
 */

import { useChartContext } from '../ChartContext';
import { createColorScale, type ColorScaleType } from '../utils/colorScales';

export interface HeatmapCell {
  row: string | number;
  col: string | number;
  value: number;
}

export interface HeatmapProps {
  // Data can be:
  // 1. Array of {row, col, value} objects
  // 2. 2D array of numbers (via matrix prop)
  data?: HeatmapCell[];
  matrix?: number[][];
  rowLabels?: string[];
  colLabels?: string[];

  // Color scale
  colorScale?: ColorScaleType | string[];
  domain?: [number, number] | 'auto';

  // Appearance
  cellSize?: number;
  cellGap?: number;
  showValues?: boolean;
  valueFormat?: (value: number) => string;
  strokeWidth?: number;

  // Label for legend
  label?: string;
}

export function Heatmap({
  data: dataProp,
  matrix,
  rowLabels,
  colLabels,
  colorScale = 'viridis',
  domain = 'auto',
  cellSize = 20,
  cellGap = 1,
  showValues = false,
  valueFormat = (v) => v.toFixed(1),
  strokeWidth = 0.5,
  label
}: HeatmapProps) {
  const ctx = useChartContext();

  // Convert matrix to cell format if provided
  let cells: HeatmapCell[] = [];

  if (matrix) {
    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        cells.push({
          row: rowLabels ? rowLabels[i] : i,
          col: colLabels ? colLabels[j] : j,
          value
        });
      });
    });
  } else if (dataProp) {
    cells = dataProp;
  } else if (ctx.data) {
    // Try to infer from context data
    cells = ctx.data as HeatmapCell[];
  }

  if (cells.length === 0) {
    console.warn('Heatmap: no data provided');
    return null;
  }

  // Get unique rows and columns
  const uniqueRows = Array.from(new Set(cells.map((c) => String(c.row)))).sort();
  const uniqueCols = Array.from(new Set(cells.map((c) => String(c.col)))).sort();

  // Calculate domain
  const values = cells.map((c) => c.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const actualDomain: [number, number] = domain === 'auto' ? [minValue, maxValue] : domain;

  // Create color scale
  const scale = typeof colorScale === 'string'
    ? createColorScale({ type: colorScale as ColorScaleType, domain: actualDomain })
    : createColorScale({ colors: colorScale, domain: actualDomain });

  // Create a map for quick lookups
  const cellMap = new Map<string, number>();
  cells.forEach((cell) => {
    const key = `${cell.row}-${cell.col}`;
    cellMap.set(key, cell.value);
  });

  const totalWidth = uniqueCols.length * (cellSize + cellGap) - cellGap;
  const totalHeight = uniqueRows.length * (cellSize + cellGap) - cellGap;

  // Calculate label sizes
  const rowLabelWidth = 80;
  const colLabelHeight = 80;
  const marginTop = 10;
  const marginLeft = 10;

  return (
    <g data-label={label} transform={`translate(${marginLeft + rowLabelWidth}, ${marginTop + colLabelHeight})`}>
      {/* Column labels */}
      {uniqueCols.map((col, colIdx) => {
        const x = colIdx * (cellSize + cellGap) + cellSize / 2;
        return (
          <text
            key={`col-${colIdx}`}
            x={x}
            y={-10}
            fontSize={ctx.theme.typography.sizes.tick}
            fill={ctx.theme.colors.foreground}
            textAnchor="middle"
            transform={`rotate(-45, ${x}, ${-10})`}
          >
            {col}
          </text>
        );
      })}

      {/* Row labels */}
      {uniqueRows.map((row, rowIdx) => {
        const y = rowIdx * (cellSize + cellGap) + cellSize / 2;
        return (
          <text
            key={`row-${rowIdx}`}
            x={-10}
            y={y + 4}
            fontSize={ctx.theme.typography.sizes.tick}
            fill={ctx.theme.colors.foreground}
            textAnchor="end"
          >
            {row}
          </text>
        );
      })}

      {/* Heatmap cells */}
      {uniqueRows.map((row, rowIdx) => {
        return uniqueCols.map((col, colIdx) => {
          const key = `${row}-${col}`;
          const value = cellMap.get(key);

          if (value === undefined) return null;

          const x = colIdx * (cellSize + cellGap);
          const y = rowIdx * (cellSize + cellGap);
          const color = scale(value);

          // Calculate text color (light text on dark cells, dark text on light cells)
          const brightness = getBrightness(color);
          const textColor = brightness > 128 ? ctx.theme.colors.foreground : ctx.theme.colors.background;

          return (
            <g key={key}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={color}
                stroke={ctx.theme.colors.grid}
                strokeWidth={strokeWidth}
              />
              {showValues && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2 + 4}
                  fontSize={Math.min(cellSize / 3, ctx.theme.typography.sizes.tick)}
                  fill={textColor}
                  textAnchor="middle"
                >
                  {valueFormat(value)}
                </text>
              )}
            </g>
          );
        });
      })}
    </g>
  );
}

/**
 * Calculate perceived brightness of a color
 */
function getBrightness(color: string): number {
  // Simple brightness calculation from hex color
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  // For rgb() format
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match) {
      const [r, g, b] = match.map(Number);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }
  }

  return 128; // Default to middle brightness
}
