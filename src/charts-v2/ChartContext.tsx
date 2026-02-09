/**
 * Smart Chart Context - provides data analysis and scales to children
 */

import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react';
import type { DataTypeStats, FieldInfo } from '@/core/data-types';
import { analyzeData, selectDefaultFields } from '@/core/data-types';
import type { AnyScale, ScaleConfig } from '@/core/scales-v2';
import { createScale, getUniqueValues } from '@/core/scales-v2';
import type { Margin } from '@/core/layout';
import { computeMargins, computePlotDimensions } from '@/core/layout';
import type { Theme } from '@/core/theme-v2';
import { defaultTheme } from '@/core/theme-v2';

export interface SeriesInfo {
  id: string;
  label: string;
  color: string;
  shape?: 'line' | 'scatter' | 'bar' | 'area';
  visible?: boolean;
}

export interface ChartContextValue {
  // Data
  data: any[];
  stats: DataTypeStats;

  // Dimensions
  width: number;
  height: number;
  margin: Margin;
  plotWidth: number;
  plotHeight: number;

  // Scales
  xScale?: AnyScale;
  yScale?: AnyScale;
  colorScale?: AnyScale;

  // Field mappings
  xField?: string;
  yField?: string;
  colorField?: string;

  // Labels
  title?: string;
  xLabel?: string;
  yLabel?: string;

  // Theme
  theme: Theme;

  // Series registration for legend
  series: SeriesInfo[];
  registerSeries: (series: SeriesInfo) => void;
  unregisterSeries: (id: string) => void;

  // Helpers
  getColor: (index: number) => string;
  getSeriesColor: (label: string) => string;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChartContext() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('Chart components must be used within a Chart container');
  }
  return context;
}

export interface ChartProviderProps<T extends Record<string, any>> {
  // Data
  data: T[];

  // Dimensions
  width: number;
  height: number;
  margin?: Partial<Margin>;

  // Field mappings
  x?: string;
  y?: string;
  color?: string;

  // Scale configurations
  xScale?: ScaleConfig;
  yScale?: ScaleConfig;
  colorScale?: ScaleConfig;

  // Labels
  title?: string;
  xLabel?: string;
  yLabel?: string;

  // Theme
  theme?: Theme;

  // Legend
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';

  // Children
  children: ReactNode;
}

export function ChartProvider<T extends Record<string, any>>({
  data,
  width,
  height,
  margin: marginOverride,
  x,
  y,
  color,
  xScale: xScaleConfig,
  yScale: yScaleConfig,
  colorScale: colorScaleConfig,
  title,
  xLabel,
  yLabel,
  theme = defaultTheme,
  showLegend,
  legendPosition,
  children
}: ChartProviderProps<T>) {
  // Series registration state
  const [series, setSeries] = useState<SeriesInfo[]>([]);

  const registerSeries = useCallback((seriesInfo: SeriesInfo) => {
    setSeries(prev => {
      // Check if series already registered
      const existing = prev.find(s => s.id === seriesInfo.id);
      if (existing) {
        // Update existing
        return prev.map(s => s.id === seriesInfo.id ? seriesInfo : s);
      }
      // Add new
      return [...prev, seriesInfo];
    });
  }, []);

  const unregisterSeries = useCallback((id: string) => {
    setSeries(prev => prev.filter(s => s.id !== id));
  }, []);

  const contextValue = useMemo(() => {
    // Analyze data
    const stats = analyzeData(data);

    // Select default fields if not provided
    const defaults = selectDefaultFields(stats);
    const xField = x || defaults.x;
    const yField = y || defaults.y;
    const colorField = color;

    // Compute margins
    const autoMargin = computeMargins(width, height, {
      title,
      xLabel,
      yLabel,
      showLegend,
      legendPosition,
      fontSize: {
        title: theme.typography.sizes.title,
        label: theme.typography.sizes.label,
        tick: theme.typography.sizes.tick
      }
    });

    const margin: Margin = {
      top: marginOverride?.top ?? autoMargin.top,
      right: marginOverride?.right ?? autoMargin.right,
      bottom: marginOverride?.bottom ?? autoMargin.bottom,
      left: marginOverride?.left ?? autoMargin.left
    };

    const { width: plotWidth, height: plotHeight } = computePlotDimensions(width, height, margin);

    // Create scales
    let xScale: AnyScale | undefined;
    let yScale: AnyScale | undefined;
    let colorScaleObj: AnyScale | undefined;

    if (xField && stats.fields[xField]) {
      const field = stats.fields[xField];
      // For band scales, get actual unique values from data
      if (field.type === 'ordinal' || field.type === 'nominal') {
        const uniqueValues = getUniqueValues(data, xField);
        const fieldWithValues: FieldInfo = { ...field, domain: uniqueValues as any };
        xScale = createScale(fieldWithValues, [0, plotWidth], xScaleConfig);
      } else {
        xScale = createScale(field, [0, plotWidth], xScaleConfig);
      }
    }

    if (yField && stats.fields[yField]) {
      const field = stats.fields[yField];
      // Invert Y scale for SVG coordinates
      yScale = createScale(field, [plotHeight, 0], yScaleConfig);
    }

    if (colorField && stats.fields[colorField]) {
      const field = stats.fields[colorField];
      const palette = theme.colors.palette;
      colorScaleObj = createScale(field, palette, colorScaleConfig);
    }

    const getColor = (index: number) => {
      return theme.colors.palette[index % theme.colors.palette.length];
    };

    const getSeriesColor = (label: string) => {
      const seriesInfo = series.find(s => s.label === label);
      if (seriesInfo) return seriesInfo.color;
      // Fallback to palette based on label hash
      const hash = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return theme.colors.palette[hash % theme.colors.palette.length];
    };

    return {
      data,
      stats,
      width,
      height,
      margin,
      plotWidth,
      plotHeight,
      xScale,
      yScale,
      colorScale: colorScaleObj,
      xField,
      yField,
      colorField,
      title,
      xLabel,
      yLabel,
      theme,
      series,
      registerSeries,
      unregisterSeries,
      getColor,
      getSeriesColor
    };
  }, [
    data,
    width,
    height,
    marginOverride,
    x,
    y,
    color,
    xScaleConfig,
    yScaleConfig,
    colorScaleConfig,
    title,
    xLabel,
    yLabel,
    theme,
    showLegend,
    legendPosition,
    series,
    registerSeries,
    unregisterSeries
  ]);

  return <ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>;
}
