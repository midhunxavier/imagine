import { Children } from 'react';
import { theme } from '../theme';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function panelLabel(i: number) {
  return alphabet[i] ? `${alphabet[i]})` : `${i + 1})`;
}

export function PanelGrid({
  x,
  y,
  width,
  height,
  rows,
  cols,
  gap = theme.spacing.lg,
  margin = theme.spacing.lg,
  showLabels = true,
  children
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
  gap?: number;
  margin?: number;
  showLabels?: boolean;
  children: React.ReactNode;
}) {
  const items = Children.toArray(children);
  const innerW = width - 2 * margin - (cols - 1) * gap;
  const innerH = height - 2 * margin - (rows - 1) * gap;
  const cellW = innerW / cols;
  const cellH = innerH / rows;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {items.map((child, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const cx = margin + col * (cellW + gap);
        const cy = margin + row * (cellH + gap);
        return (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            {showLabels ? (
              <text x={0} y={-8} fontSize={12} fill={theme.colors.subtleText} fontWeight={600}>
                {panelLabel(i)}
              </text>
            ) : null}
            <g>{child}</g>
          </g>
        );
      })}
    </g>
  );
}

