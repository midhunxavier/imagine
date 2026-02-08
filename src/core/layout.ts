/**
 * Adaptive margin and layout computation
 */

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LayoutConfig {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  fontSize?: {
    title?: number;
    label?: number;
    tick?: number;
  };
}

/**
 * Estimate text width (rough approximation)
 */
function estimateTextWidth(text: string, fontSize: number): number {
  // Rough estimate: ~0.6 * fontSize per character for sans-serif
  return text.length * fontSize * 0.6;
}

/**
 * Compute adaptive margins based on labels and content
 */
export function computeMargins(width: number, height: number, config: LayoutConfig = {}): Margin {
  const fontSize = {
    title: config.fontSize?.title || 14,
    label: config.fontSize?.label || 12,
    tick: config.fontSize?.tick || 10
  };

  let margin: Margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 50
  };

  // Add space for title
  if (config.title) {
    margin.top += fontSize.title + 10;
  }

  // Add space for x-axis label
  if (config.xLabel) {
    margin.bottom += fontSize.label + 10;
  }

  // Add space for y-axis label
  if (config.yLabel) {
    margin.left = Math.max(margin.left, fontSize.label + 50);
  }

  // Add space for legend
  if (config.showLegend) {
    const pos = config.legendPosition || 'right';
    switch (pos) {
      case 'top':
        margin.top += 30;
        break;
      case 'bottom':
        margin.bottom += 30;
        break;
      case 'left':
        margin.left += 100;
        break;
      case 'right':
        margin.right += 100;
        break;
    }
  }

  // Ensure margins don't consume too much space
  const maxMarginWidth = width * 0.4;
  const maxMarginHeight = height * 0.4;

  margin.left = Math.min(margin.left, maxMarginWidth / 2);
  margin.right = Math.min(margin.right, maxMarginWidth / 2);
  margin.top = Math.min(margin.top, maxMarginHeight / 2);
  margin.bottom = Math.min(margin.bottom, maxMarginHeight / 2);

  return margin;
}

/**
 * Compute plot dimensions from figure size and margins
 */
export function computePlotDimensions(width: number, height: number, margin: Margin) {
  return {
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
    margin
  };
}
