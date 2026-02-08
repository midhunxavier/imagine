import { Figure } from '../framework/Figure';
import type { FigureComponentBaseProps } from '../framework/types';
import { theme } from '../framework/theme';
import { MathSvg } from '../framework/math/MathSvg';

export default function EquationFigure({
  width,
  height,
  background,
  tex
}: FigureComponentBaseProps & { tex?: string }) {
  return (
    <Figure width={width} height={height} background={background} title="Equation">
      <text x={40} y={54} fontSize={18} fontWeight={800} fill={theme.colors.text}>
        Example: equation (MathJax SVG)
      </text>
      <text x={40} y={84} fontSize={13} fill={theme.colors.subtleText}>
        Uses MathJax tex2svg (kept pure SVG; no foreignObject)
      </text>

      <g transform={`translate(40, 120)`}>
        <rect x={0} y={0} width={width - 80} height={height - 160} rx={theme.radii.md} fill={theme.colors.panel} />
        <MathSvg tex={tex ?? String.raw`E=mc^2`} x={24} y={40} scale={1.1} />
      </g>
    </Figure>
  );
}

