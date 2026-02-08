import type { ReactNode } from 'react';
import type { ScaleLinear } from 'd3-scale';
import { theme } from '../theme';

export type TickFormatter = (value: number) => string;

function defaultFormat(value: number) {
  return String(value);
}

export function AxisBottom({
  x,
  y,
  scale,
  tickCount = 5,
  tickFormat = defaultFormat,
  label
}: {
  x: number;
  y: number;
  scale: ScaleLinear<number, number>;
  tickCount?: number;
  tickFormat?: TickFormatter;
  label?: ReactNode;
}) {
  const ticks = scale.ticks(tickCount);
  const [d0, d1] = scale.domain();
  const x0 = scale(d0);
  const x1 = scale(d1);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <line x1={x0} y1={0} x2={x1} y2={0} stroke={theme.colors.axis} strokeWidth={theme.strokes.normal} />
      {ticks.map((t) => {
        const px = scale(t);
        return (
          <g key={t} transform={`translate(${px}, 0)`}>
            <line y2={6} stroke={theme.colors.axis} strokeWidth={theme.strokes.thin} />
            <text y={18} fontSize={11} fill={theme.colors.text} textAnchor="middle">
              {tickFormat(t)}
            </text>
          </g>
        );
      })}
      {label ? (
        <text x={(x0 + x1) / 2} y={36} fontSize={12} fill={theme.colors.text} textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function AxisLeft({
  x,
  y,
  scale,
  tickCount = 5,
  tickFormat = defaultFormat,
  label
}: {
  x: number;
  y: number;
  scale: ScaleLinear<number, number>;
  tickCount?: number;
  tickFormat?: TickFormatter;
  label?: ReactNode;
}) {
  const ticks = scale.ticks(tickCount);
  const [d0, d1] = scale.domain();
  const y0 = scale(d0);
  const y1 = scale(d1);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <line x1={0} y1={y0} x2={0} y2={y1} stroke={theme.colors.axis} strokeWidth={theme.strokes.normal} />
      {ticks.map((t) => {
        const py = scale(t);
        return (
          <g key={t} transform={`translate(0, ${py})`}>
            <line x2={-6} stroke={theme.colors.axis} strokeWidth={theme.strokes.thin} />
            <text x={-10} y={4} fontSize={11} fill={theme.colors.text} textAnchor="end">
              {tickFormat(t)}
            </text>
          </g>
        );
      })}
      {label ? (
        <text
          x={-42}
          y={(y0 + y1) / 2}
          fontSize={12}
          fill={theme.colors.text}
          textAnchor="middle"
          transform={`rotate(-90, ${-42}, ${(y0 + y1) / 2})`}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

