import { useId } from 'react';
import { theme } from '../theme';

function safeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export function Label({
  x,
  y,
  text,
  fontSize = 13,
  fill = theme.colors.text,
  anchor = 'start'
}: {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} fontSize={fontSize} fill={fill} textAnchor={anchor} dominantBaseline="middle">
      {text}
    </text>
  );
}

export function Box({
  x,
  y,
  width,
  height,
  rx = theme.radii.md,
  fill = theme.colors.panel,
  stroke = theme.colors.axis,
  strokeWidth = theme.strokes.normal,
  label
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  label?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {label ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          fontSize={13}
          fill={theme.colors.text}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  stroke = theme.colors.axis,
  strokeWidth = theme.strokes.thick
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  const rid = safeId(useId());
  const markerId = `im-arrow-${rid}`;

  return (
    <g>
      <defs>
        <marker id={markerId} markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );
}

export function Callout({
  x,
  y,
  width,
  height,
  text,
  fill = '#FEF3C7',
  stroke = '#F59E0B'
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={theme.radii.sm} fill={fill} stroke={stroke} />
      <text x={x + theme.spacing.sm} y={y + height / 2} fontSize={12} fill={theme.colors.text} dominantBaseline="middle">
        {text}
      </text>
    </g>
  );
}

