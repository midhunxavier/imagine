/**
 * Statistical utilities for chart components
 */

/**
 * Calculate percentile of a sorted array
 */
export function percentile(sortedArray: number[], p: number): number {
  if (sortedArray.length === 0) return 0;
  if (p <= 0) return sortedArray[0];
  if (p >= 1) return sortedArray[sortedArray.length - 1];

  const index = (sortedArray.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) {
    return sortedArray[lower];
  }

  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Calculate quartiles (Q1, Q2/median, Q3)
 */
export function quartiles(sortedArray: number[]): { q1: number; q2: number; q3: number } {
  return {
    q1: percentile(sortedArray, 0.25),
    q2: percentile(sortedArray, 0.5),
    q3: percentile(sortedArray, 0.75)
  };
}

/**
 * Calculate interquartile range
 */
export function iqr(sortedArray: number[]): number {
  const { q1, q3 } = quartiles(sortedArray);
  return q3 - q1;
}

/**
 * Box plot statistics
 */
export interface BoxPlotStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  whiskerLow: number;
  whiskerHigh: number;
}

/**
 * Calculate box plot statistics
 */
export function boxPlotStats(data: number[], method: 'tukey' | 'minmax' = 'tukey'): BoxPlotStats {
  if (data.length === 0) {
    return {
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0,
      outliers: [],
      whiskerLow: 0,
      whiskerHigh: 0
    };
  }

  const sorted = [...data].sort((a, b) => a - b);
  const { q1, q2: median, q3 } = quartiles(sorted);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  if (method === 'minmax') {
    return {
      min,
      q1,
      median,
      q3,
      max,
      outliers: [],
      whiskerLow: min,
      whiskerHigh: max
    };
  }

  // Tukey's method (1.5 * IQR)
  const iqrValue = iqr(sorted);
  const lowerFence = q1 - 1.5 * iqrValue;
  const upperFence = q3 + 1.5 * iqrValue;

  // Find whisker positions (first/last point within fences)
  let whiskerLow = q1;
  let whiskerHigh = q3;
  const outliers: number[] = [];

  for (const value of sorted) {
    if (value < lowerFence || value > upperFence) {
      outliers.push(value);
    } else {
      if (value < q1) whiskerLow = Math.min(whiskerLow, value);
      if (value > q3) whiskerHigh = Math.max(whiskerHigh, value);
    }
  }

  // Ensure whiskers are within data range
  whiskerLow = Math.max(whiskerLow, min);
  whiskerHigh = Math.min(whiskerHigh, max);

  return {
    min,
    q1,
    median,
    q3,
    max,
    outliers,
    whiskerLow,
    whiskerHigh
  };
}

/**
 * Kernel density estimation using Gaussian kernel
 */
export function kde(
  data: number[],
  bandwidth: number,
  numPoints: number = 100
): Array<{ x: number; y: number }> {
  if (data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;
  const padding = range * 0.1;

  const result: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < numPoints; i++) {
    const x = min - padding + ((range + 2 * padding) * i) / (numPoints - 1);
    let density = 0;

    for (const point of data) {
      const z = (x - point) / bandwidth;
      // Gaussian kernel
      density += Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    }

    density /= data.length * bandwidth;
    result.push({ x, y: density });
  }

  return result;
}

/**
 * Automatic bandwidth selection using Silverman's rule of thumb
 */
export function silvermanBandwidth(data: number[]): number {
  if (data.length === 0) return 1;

  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  
  // Calculate standard deviation
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
  const variance = sorted.reduce((sum, val) => sum + (val - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  // Silverman's rule: 1.06 * σ * n^(-1/5)
  return 1.06 * stdDev * Math.pow(n, -1 / 5);
}

/**
 * Calculate histogram bins using Sturges' rule
 */
export function sturgesBins(data: number[]): number {
  return Math.ceil(Math.log2(data.length) + 1);
}

/**
 * Calculate histogram bins using Freedman-Diaconis rule
 */
export function freedmanDiaconisBins(data: number[]): number {
  if (data.length === 0) return 10;

  const sorted = [...data].sort((a, b) => a - b);
  const iqrValue = iqr(sorted);
  const range = sorted[sorted.length - 1] - sorted[0];

  if (iqrValue === 0) return sturgesBins(data);

  const binWidth = 2 * iqrValue * Math.pow(data.length, -1 / 3);
  return Math.ceil(range / binWidth);
}

/**
 * Create histogram bins
 */
export interface HistogramBin {
  x0: number;
  x1: number;
  count: number;
  density: number;
}

export function histogram(
  data: number[],
  bins: number | number[]
): HistogramBin[] {
  if (data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  let edges: number[];

  if (typeof bins === 'number') {
    // Create evenly spaced bins
    edges = [];
    for (let i = 0; i <= bins; i++) {
      edges.push(min + ((max - min) * i) / bins);
    }
  } else {
    edges = [...bins].sort((a, b) => a - b);
  }

  const result: HistogramBin[] = [];

  for (let i = 0; i < edges.length - 1; i++) {
    const x0 = edges[i];
    const x1 = edges[i + 1];
    const count = sorted.filter((v) => v >= x0 && (i === edges.length - 2 ? v <= x1 : v < x1)).length;
    const binWidth = x1 - x0;
    const density = count / (data.length * binWidth);

    result.push({ x0, x1, count, density });
  }

  return result;
}
