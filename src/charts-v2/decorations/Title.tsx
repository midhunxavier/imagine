/**
 * Title Component for Charts
 */

import { useChartContext } from '../ChartContext';

export interface TitleProps {
  text?: string;
  subtitle?: string;
}

export function Title({ text, subtitle }: TitleProps) {
  const ctx = useChartContext();
  const { margin, theme } = ctx;

  if (!text) return null;

  return (
    <g transform={`translate(${margin.left}, 0)`}>
      <text
        x={0}
        y={theme.typography.sizes.title + 8}
        fontSize={theme.typography.sizes.title}
        fontWeight={theme.typography.weights.bold}
        fill={theme.colors.foreground}
      >
        {text}
      </text>
      {subtitle && (
        <text
          x={0}
          y={theme.typography.sizes.title + theme.typography.sizes.subtitle + 12}
          fontSize={theme.typography.sizes.subtitle}
          fill={theme.colors.muted}
        >
          {subtitle}
        </text>
      )}
    </g>
  );
}
