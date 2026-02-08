import type { ScaleLinear } from 'd3-scale';
import { line as d3Line, curveMonotoneX } from 'd3-shape';
import type { Point } from './scales';
import { theme } from '../theme';

export function LineSeries({
  xScale,
  yScale,
  data,
  stroke = theme.colors.blue,
  strokeWidth = theme.strokes.thick
}: {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  data: Point[];
  stroke?: string;
  strokeWidth?: number;
}) {
  const d = d3Line<Point>()
    .x((p) => xScale(p.x))
    .y((p) => yScale(p.y))
    .curve(curveMonotoneX)(data);

  if (!d) return null;

  return <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} />;
}

export function ScatterSeries({
  xScale,
  yScale,
  data,
  r = 3,
  fill = theme.colors.teal
}: {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  data: Point[];
  r?: number;
  fill?: string;
}) {
  return (
    <g>
      {data.map((p, idx) => (
        <circle key={idx} cx={xScale(p.x)} cy={yScale(p.y)} r={r} fill={fill} />
      ))}
    </g>
  );
}

