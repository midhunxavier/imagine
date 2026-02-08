import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import { theme } from '@/framework/theme';

export default function HelloWorldFigure({
  width,
  height,
  background,
  heading = 'Imagine',
  subtitle = 'React components → scientific figures (PNG + SVG)',
  tipHeading = 'Tips',
  tip1 = 'Edit the figure component and watch this update live.',
  tip2 = 'Use the Controls panel to adjust text, then export via `npm run render`.'
}: FigureComponentBaseProps & {
  heading?: string;
  subtitle?: string;
  tipHeading?: string;
  tip1?: string;
  tip2?: string;
}) {
  return (
    <Figure width={width} height={height} background={background} title="Hello world">
      <g>
        <text x={40} y={70} fontSize={34} fontWeight={700} fill={theme.colors.text}>
          {heading}
        </text>
        <text x={40} y={110} fontSize={16} fill={theme.colors.subtleText}>
          {subtitle}
        </text>

        <rect x={40} y={150} width={width - 80} height={height - 190} rx={theme.radii.md} fill={theme.colors.panel} />

        <text x={70} y={210} fontSize={16} fill={theme.colors.text} fontWeight={600}>
          {tipHeading}
        </text>
        <text x={70} y={245} fontSize={14} fill={theme.colors.text}>
          • {tip1}
        </text>
        <text x={70} y={270} fontSize={14} fill={theme.colors.text}>
          • {tip2}
        </text>
      </g>
    </Figure>
  );
}
