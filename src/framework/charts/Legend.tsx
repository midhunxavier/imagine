import { theme } from '../theme';

export type LegendItem = { label: string; color: string };

export function Legend({
  x,
  y,
  items,
  fontSize = 12,
  rowGap = 6
}: {
  x: number;
  y: number;
  items: LegendItem[];
  fontSize?: number;
  rowGap?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {items.map((it, i) => (
        <g key={it.label} transform={`translate(0, ${i * (fontSize + rowGap)})`}>
          <rect x={0} y={-fontSize + 3} width={12} height={12} fill={it.color} rx={2} />
          <text x={18} y={0} fontSize={fontSize} fill={theme.colors.text} dominantBaseline="middle">
            {it.label}
          </text>
        </g>
      ))}
    </g>
  );
}

