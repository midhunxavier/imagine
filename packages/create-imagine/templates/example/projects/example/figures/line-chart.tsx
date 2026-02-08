import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import { theme } from '@/framework/theme';
import type { Point } from '@/framework/charts/scales';
import { extentX, extentY, linearScale } from '@/framework/charts/scales';
import { AxisBottom, AxisLeft } from '@/framework/charts/Axes';
import { GridLines } from '@/framework/charts/GridLines';
import { LineSeries, ScatterSeries } from '@/framework/charts/Series';
import { Legend } from '@/framework/charts/Legend';

const dataA: Point[] = [
  { x: 0, y: 0.2 },
  { x: 1, y: 0.9 },
  { x: 2, y: 1.3 },
  { x: 3, y: 1.8 },
  { x: 4, y: 2.2 },
  { x: 5, y: 2.4 }
];

const dataB: Point[] = [
  { x: 0, y: 0.4 },
  { x: 1, y: 0.7 },
  { x: 2, y: 1.1 },
  { x: 3, y: 1.5 },
  { x: 4, y: 1.9 },
  { x: 5, y: 2.15 }
];

export default function LineChartFigure({
  width,
  height,
  background,
  title = 'Example: signal over time',
  xLabel = 'Time (a.u.)',
  yLabel = 'Response',
  seriesALabel = 'Condition A',
  seriesBLabel = 'Condition B'
}: FigureComponentBaseProps & {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  seriesALabel?: string;
  seriesBLabel?: string;
}) {
  const margin = { left: 70, top: 40, right: 20, bottom: 60 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const all = [...dataA, ...dataB];
  const xScale = linearScale(extentX(all), [0, plotW]);
  const yScale = linearScale(extentY(all), [plotH, 0]);

  return (
    <Figure width={width} height={height} background={background} title="Line chart">
      <text x={margin.left} y={22} fontSize={14} fill={theme.colors.text} fontWeight={700}>
        {title}
      </text>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <rect x={0} y={0} width={plotW} height={plotH} fill="transparent" />
        <GridLines x={0} y={0} width={plotW} height={plotH} xScale={xScale} yScale={yScale} />
        <LineSeries xScale={xScale} yScale={yScale} data={dataA} stroke={theme.colors.blue} />
        <ScatterSeries xScale={xScale} yScale={yScale} data={dataA} fill={theme.colors.blue} />
        <LineSeries xScale={xScale} yScale={yScale} data={dataB} stroke={theme.colors.teal} />
        <ScatterSeries xScale={xScale} yScale={yScale} data={dataB} fill={theme.colors.teal} />
      </g>

      <AxisLeft x={margin.left} y={margin.top} scale={yScale} label={yLabel} />
      <AxisBottom x={margin.left} y={height - margin.bottom} scale={xScale} label={xLabel} />

      <Legend
        x={width - 210}
        y={48}
        items={[
          { label: seriesALabel, color: theme.colors.blue },
          { label: seriesBLabel, color: theme.colors.teal }
        ]}
      />
    </Figure>
  );
}
