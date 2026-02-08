/**
 * Color scale utilities for heatmaps and other visualizations
 */

import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateViridis, interpolatePlasma, interpolateInferno, interpolateCividis, interpolateRdBu, interpolateBrBG } from 'd3-scale-chromatic';

export type ColorScaleType = 'viridis' | 'plasma' | 'inferno' | 'cividis' | 'rdbu' | 'brbg' | 'sequential' | 'diverging';

export interface ColorScaleConfig {
  type?: ColorScaleType;
  domain?: [number, number];
  colors?: string[];
  reverse?: boolean;
}

/**
 * Create a color scale for continuous data
 */
export function createColorScale(config: ColorScaleConfig = {}) {
  const { type = 'viridis', domain = [0, 1], colors, reverse = false } = config;

  if (colors && colors.length >= 2) {
    // Custom color scale
    let scale = scaleLinear<string>()
      .domain(domain)
      .range(reverse ? [...colors].reverse() : colors);
    return (value: number) => scale(value);
  }

  // D3 chromatic scales
  const interpolators = {
    viridis: interpolateViridis,
    plasma: interpolatePlasma,
    inferno: interpolateInferno,
    cividis: interpolateCividis,
    rdbu: interpolateRdBu,
    brbg: interpolateBrBG,
    sequential: interpolateViridis, // Default sequential
    diverging: interpolateRdBu // Default diverging
  };

  const interpolator = interpolators[type] || interpolateViridis;

  if (reverse) {
    return scaleSequential(domain, (t) => interpolator(1 - t));
  }

  return scaleSequential(domain, interpolator);
}

/**
 * Get a categorical color from a palette
 */
export function categoricalColor(index: number, palette: string[]): string {
  return palette[index % palette.length];
}

/**
 * Convert value to color using a scale
 */
export function valueToColor(value: number, scale: ReturnType<typeof createColorScale>): string {
  return scale(value);
}
