import { Figure } from '../framework/Figure';
import type { FigureComponentBaseProps } from '../framework/types';
import { theme } from '../framework/theme';

export default function HelloWorldFigure({ width, height, background }: FigureComponentBaseProps) {
  return (
    <Figure width={width} height={height} background={background} title="Hello world">
      <g>
        <text x={40} y={70} fontSize={34} fontWeight={700} fill={theme.colors.text}>
          Imagine
        </text>
        <text x={40} y={110} fontSize={16} fill={theme.colors.subtleText}>
          React components → scientific figures (PNG + SVG)
        </text>

        <rect x={40} y={150} width={width - 80} height={height - 190} rx={theme.radii.md} fill={theme.colors.panel} />

        <text x={70} y={210} fontSize={16} fill={theme.colors.text} fontWeight={600}>
          Tips
        </text>
        <text x={70} y={245} fontSize={14} fill={theme.colors.text}>
          • Edit `src/figures/hello-world.tsx` and watch this update live.
        </text>
        <text x={70} y={270} fontSize={14} fill={theme.colors.text}>
          • Run `npm run render` to export PNG + SVG to `out/`.
        </text>
      </g>
    </Figure>
  );
}

