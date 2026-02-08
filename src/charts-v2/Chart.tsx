/**
 * Smart Chart Component - Simplified API with auto-inference
 */

import { type ReactNode } from 'react';
import { Figure } from '@/framework/Figure';
import { ChartProvider, type ChartProviderProps } from './ChartContext';
import type { FigureComponentBaseProps } from '@/framework/types';
import type { ScaleConfig } from '@/core/scales-v2';
import type { Theme, ThemeName } from '@/core/theme-v2';
import { themes } from '@/core/theme-v2';
import type { Margin } from '@/core/layout';

export interface ChartProps<T extends Record<string, any>> extends FigureComponentBaseProps {
  // Data (required)
  data: T[];

  // Field mappings (auto-inferred if not provided)
  x?: string;
  y?: string;
  color?: string;

  // Scale configurations (auto-selected if not provided)
  xScale?: ScaleConfig;
  yScale?: ScaleConfig;
  colorScale?: ScaleConfig;

  // Labels
  title?: string;
  xLabel?: string;
  yLabel?: string;

  // Layout
  margin?: Partial<Margin>;

  // Theme
  theme?: Theme | ThemeName;

  // Grid
  showGrid?: boolean | 'x' | 'y';

  // Legend
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';

  // Children
  children: ReactNode;
}

export function Chart<T extends Record<string, any>>({
  data,
  width,
  height,
  background = 'white',
  x,
  y,
  color,
  xScale,
  yScale,
  colorScale,
  title,
  xLabel,
  yLabel,
  margin,
  theme = 'default',
  showGrid,
  showLegend,
  legendPosition,
  children
}: ChartProps<T>) {
  // Resolve theme
  const themeObj: Theme = typeof theme === 'string' ? themes[theme] : theme;

  return (
    <Figure width={width} height={height} background={background} title={title}>
      <ChartProvider
        data={data}
        width={width}
        height={height}
        margin={margin}
        x={x}
        y={y}
        color={color}
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
        title={title}
        xLabel={xLabel}
        yLabel={yLabel}
        theme={themeObj}
        showLegend={showLegend}
        legendPosition={legendPosition}
      >
        {children}
      </ChartProvider>
    </Figure>
  );
}
