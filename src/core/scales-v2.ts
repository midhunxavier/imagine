/**
 * Enhanced scale creation with auto-inference
 */

import { scaleLinear, scaleLog, scaleTime, scaleBand, scaleOrdinal, type ScaleLinear, type ScaleLogarithmic, type ScaleTime, type ScaleBand, type ScaleOrdinal } from 'd3-scale';
import type { FieldInfo, FieldType } from './data-types';

export type ScaleType = 'linear' | 'log' | 'time' | 'band' | 'ordinal';

export interface ScaleConfig {
  type?: ScaleType;
  domain?: [any, any] | any[];
  range?: [number, number] | string[];
  padding?: number; // For band scales
  paddingInner?: number;
  paddingOuter?: number;
  nice?: boolean; // Round domain to nice values
  clamp?: boolean;
  base?: number; // For log scales
}

export type AnyScale =
  | ScaleLinear<number, number>
  | ScaleLogarithmic<number, number>
  | ScaleTime<number, number>
  | ScaleBand<string>
  | ScaleOrdinal<string, any>;

/**
 * Auto-select scale type based on field info
 */
export function selectScaleType(field: FieldInfo): ScaleType {
  switch (field.type) {
    case 'quantitative':
      // Check if log scale would be appropriate (large range, positive values)
      if (field.domain[0] > 0 && field.domain[1] / field.domain[0] > 100) {
        return 'log';
      }
      return 'linear';
    case 'temporal':
      return 'time';
    case 'ordinal':
      return field.cardinality > 10 ? 'band' : 'band';
    case 'nominal':
      return 'band';
    default:
      return 'linear';
  }
}

/**
 * Add padding to a numeric domain
 */
function padDomain(domain: [number, number], padding: number = 0.05): [number, number] {
  const [min, max] = domain;
  const range = max - min;
  if (range === 0) return [min - 1, max + 1];
  return [min - range * padding, max + range * padding];
}

/**
 * Create a scale from field info and config
 */
export function createScale(
  field: FieldInfo,
  rangeValues: [number, number] | string[],
  config: ScaleConfig = {}
): AnyScale {
  const scaleType = config.type || selectScaleType(field);
  const domain = config.domain || field.domain;

  switch (scaleType) {
    case 'linear': {
      const paddedDomain = config.nice !== false && typeof domain[0] === 'number' 
        ? padDomain(domain as [number, number])
        : domain;
      const scale = scaleLinear()
        .domain(paddedDomain as [number, number])
        .range(rangeValues as [number, number]);
      if (config.nice !== false) scale.nice();
      if (config.clamp) scale.clamp(true);
      return scale;
    }

    case 'log': {
      const base = config.base || 10;
      const scale = scaleLog()
        .base(base)
        .domain(domain as [number, number])
        .range(rangeValues as [number, number]);
      if (config.nice !== false) scale.nice();
      if (config.clamp) scale.clamp(true);
      return scale;
    }

    case 'time': {
      const scale = scaleTime()
        .domain(domain as [Date, Date])
        .range(rangeValues as [number, number]);
      if (config.nice !== false) scale.nice();
      if (config.clamp) scale.clamp(true);
      return scale;
    }

    case 'band': {
      const uniqueValues = Array.isArray(domain) ? domain : [domain[0], domain[1]];
      const scale = scaleBand()
        .domain(uniqueValues.map(String))
        .range(rangeValues as [number, number])
        .padding(config.padding ?? 0.1);
      if (config.paddingInner !== undefined) scale.paddingInner(config.paddingInner);
      if (config.paddingOuter !== undefined) scale.paddingOuter(config.paddingOuter);
      return scale;
    }

    case 'ordinal': {
      const uniqueValues = Array.isArray(domain) ? domain : [domain[0], domain[1]];
      return scaleOrdinal()
        .domain(uniqueValues.map(String))
        .range(rangeValues as string[]);
    }

    default:
      throw new Error(`Unknown scale type: ${scaleType}`);
  }
}

/**
 * Get actual unique values from data for band/ordinal scales
 */
export function getUniqueValues<T>(data: T[], field: string): any[] {
  const values = data.map((d) => d[field as keyof T]);
  return Array.from(new Set(values));
}
