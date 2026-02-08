import type { ScaleLinear } from 'd3-scale';
import { theme } from '../theme';

export function GridLines({
  x,
  y,
  width,
  height,
  xScale,
  yScale,
  xTicks = 5,
  yTicks = 5
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xTicks?: number;
  yTicks?: number;
}) {
  const xt = xScale.ticks(xTicks);
  const yt = yScale.ticks(yTicks);

  return (
    <g transform={`translate(${x}, ${y})`} opacity={0.9}>
      {xt.map((t) => {
        const px = xScale(t);
        return (
          <line
            key={`x-${t}`}
            x1={px}
            y1={0}
            x2={px}
            y2={height}
            stroke={theme.colors.grid}
            strokeWidth={theme.strokes.thin}
          />
        );
      })}
      {yt.map((t) => {
        const py = yScale(t);
        return (
          <line
            key={`y-${t}`}
            x1={0}
            y1={py}
            x2={width}
            y2={py}
            stroke={theme.colors.grid}
            strokeWidth={theme.strokes.thin}
          />
        );
      })}
    </g>
  );
}

