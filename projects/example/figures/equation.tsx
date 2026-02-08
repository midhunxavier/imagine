import { Figure } from '@/framework/Figure';
import type { FigureComponentBaseProps } from '@/framework/types';
import { theme } from '@/framework/theme';
import { MathSvg } from '@/framework/math/MathSvg';

export default function EquationFigure({
  width,
  height,
  background,
  title = 'Example: equation (MathJax SVG)',
  subtitle = 'Uses MathJax tex2svg (pure SVG; no foreignObject)',
  tex = String.raw`E=mc^2`
}: FigureComponentBaseProps & { title?: string; subtitle?: string; tex?: string }) {
  return (
    <Figure width={width} height={height} background={background} title="Equation">
      <text x={40} y={54} fontSize={18} fontWeight={800} fill={theme.colors.text}>
        {title}
      </text>
      <text x={40} y={84} fontSize={13} fill={theme.colors.subtleText}>
        {subtitle}
      </text>

      <g transform={`translate(40, 120)`}>
        <rect x={0} y={0} width={width - 80} height={height - 160} rx={theme.radii.md} fill={theme.colors.panel} />
        <MathSvg tex={tex} x={24} y={40} scale={1.1} />
      </g>
    </Figure>
  );
}
