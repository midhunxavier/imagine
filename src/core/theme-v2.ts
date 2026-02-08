/**
 * Theme System v2 - Enhanced theming with presets
 */

import type { Margin } from './layout';

export interface ColorScale {
  colors: string[];
  interpolate?: boolean;
}

export interface Theme {
  name: string;

  // Colors
  colors: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    // Categorical palette for discrete data
    palette: string[];
    // Sequential scale for continuous data (light to dark)
    sequential: ColorScale;
    // Diverging scale for data with meaningful zero/midpoint
    diverging: ColorScale;
    // Grid and axes
    grid: string;
    axis: string;
    // Specific colors
    error: string;
    warning: string;
    success: string;
  };

  // Typography
  typography: {
    fontFamily: string;
    monoFamily: string;
    sizes: {
      title: number;
      subtitle: number;
      label: number;
      tick: number;
      annotation: number;
      legend: number;
    };
    weights: {
      normal: number;
      medium: number;
      bold: number;
    };
  };

  // Spacing
  spacing: {
    unit: number; // Base unit (4px)
    margin: Margin;
    gap: number;
    padding: number;
  };

  // Lines & Shapes
  strokes: {
    thin: number;
    normal: number;
    thick: number;
    axis: number;
    grid: number;
  };

  // Shapes
  radii: {
    sm: number;
    md: number;
    lg: number;
  };

  // Accessibility
  accessibility: {
    contrastRatio: number;
    colorblindSafe: boolean;
  };
}

/**
 * Default theme - clean, professional
 */
export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    background: '#FFFFFF',
    foreground: '#111827',
    muted: '#6B7280',
    accent: '#2563EB',
    palette: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    sequential: {
      colors: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']
    },
    diverging: {
      colors: ['#B91C1C', '#DC2626', '#F87171', '#FCA5A5', '#E5E7EB', '#93C5FD', '#60A5FA', '#2563EB', '#1D4ED8']
    },
    grid: '#E5E7EB',
    axis: '#111827',
    error: '#DC2626',
    warning: '#F59E0B',
    success: '#10B981'
  },
  typography: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    monoFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    sizes: {
      title: 16,
      subtitle: 14,
      label: 12,
      tick: 10,
      annotation: 11,
      legend: 11
    },
    weights: {
      normal: 400,
      medium: 500,
      bold: 700
    }
  },
  spacing: {
    unit: 4,
    margin: { top: 40, right: 40, bottom: 60, left: 70 },
    gap: 16,
    padding: 12
  },
  strokes: {
    thin: 0.5,
    normal: 1,
    thick: 2,
    axis: 1.5,
    grid: 0.5
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12
  },
  accessibility: {
    contrastRatio: 4.5,
    colorblindSafe: false
  }
};

/**
 * Nature journal style
 */
export const natureTheme: Theme = {
  ...defaultTheme,
  name: 'nature',
  colors: {
    ...defaultTheme.colors,
    background: '#FFFFFF',
    foreground: '#000000',
    palette: ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3', '#FF7F00', '#A65628'],
    sequential: {
      colors: ['#FFF5EB', '#FEE6CE', '#FDD0A2', '#FDAE6B', '#FD8D3C', '#F16913', '#D94801', '#8C2D04']
    }
  },
  typography: {
    ...defaultTheme.typography,
    fontFamily: 'Arial, Helvetica, sans-serif',
    sizes: {
      title: 10,
      subtitle: 9,
      label: 8,
      tick: 7,
      annotation: 7,
      legend: 7
    }
  },
  spacing: {
    ...defaultTheme.spacing,
    margin: { top: 30, right: 20, bottom: 40, left: 50 }
  }
};

/**
 * Science journal style
 */
export const scienceTheme: Theme = {
  ...defaultTheme,
  name: 'science',
  colors: {
    ...defaultTheme.colors,
    background: '#FFFFFF',
    foreground: '#000000',
    palette: ['#1B9E77', '#D95F02', '#7570B3', '#E7298A', '#66A61E', '#E6AB02'],
    sequential: {
      colors: ['#F7FCF5', '#E5F5E0', '#C7E9C0', '#A1D99B', '#74C476', '#41AB5D', '#238B45', '#005A32']
    }
  },
  typography: {
    ...defaultTheme.typography,
    fontFamily: 'Arial, Helvetica, sans-serif',
    sizes: {
      title: 9,
      subtitle: 8,
      label: 7,
      tick: 6,
      annotation: 6,
      legend: 6
    }
  }
};

/**
 * Cell journal style
 */
export const cellTheme: Theme = {
  ...defaultTheme,
  name: 'cell',
  colors: {
    ...defaultTheme.colors,
    background: '#FFFFFF',
    foreground: '#000000',
    palette: ['#00A0DC', '#FF6B35', '#7FB069', '#8B4789', '#F4A259', '#BC4B51'],
    sequential: {
      colors: ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1']
    }
  },
  typography: {
    ...defaultTheme.typography,
    fontFamily: 'Arial, Helvetica, sans-serif',
    sizes: {
      title: 10,
      subtitle: 9,
      label: 8,
      tick: 7,
      annotation: 7,
      legend: 7
    }
  }
};

/**
 * Minimal theme - ultra-clean
 */
export const minimalTheme: Theme = {
  ...defaultTheme,
  name: 'minimal',
  colors: {
    ...defaultTheme.colors,
    background: '#FFFFFF',
    foreground: '#000000',
    muted: '#9CA3AF',
    grid: '#F3F4F6'
  },
  strokes: {
    thin: 0.5,
    normal: 0.75,
    thick: 1.5,
    axis: 1,
    grid: 0.25
  }
};

/**
 * Colorblind-safe theme (Okabe-Ito palette)
 */
export const colorblindTheme: Theme = {
  ...defaultTheme,
  name: 'colorblind',
  colors: {
    ...defaultTheme.colors,
    // Okabe-Ito palette - designed for colorblind viewers
    palette: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#000000'],
    sequential: {
      colors: ['#F7F7F7', '#D9D9D9', '#BDBDBD', '#969696', '#737373', '#525252', '#252525']
    },
    diverging: {
      colors: ['#D55E00', '#E69F00', '#F0E442', '#FFFFBF', '#56B4E9', '#0072B2']
    }
  },
  accessibility: {
    contrastRatio: 7,
    colorblindSafe: true
  }
};

/**
 * Print-optimized theme (grayscale-friendly)
 */
export const printTheme: Theme = {
  ...defaultTheme,
  name: 'print',
  colors: {
    ...defaultTheme.colors,
    background: '#FFFFFF',
    foreground: '#000000',
    muted: '#4B5563',
    palette: ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB'],
    sequential: {
      colors: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937']
    },
    grid: '#D1D5DB'
  },
  strokes: {
    thin: 0.5,
    normal: 1,
    thick: 2,
    axis: 1.5,
    grid: 0.5
  }
};

/**
 * Dark theme for presentations
 */
export const darkTheme: Theme = {
  ...defaultTheme,
  name: 'dark',
  colors: {
    background: '#0F172A',
    foreground: '#F1F5F9',
    muted: '#94A3B8',
    accent: '#60A5FA',
    palette: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'],
    sequential: {
      colors: ['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9']
    },
    diverging: {
      colors: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#334155', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB']
    },
    grid: '#334155',
    axis: '#F1F5F9',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#34D399'
  }
};

/**
 * Collection of all built-in themes
 */
export const themes = {
  default: defaultTheme,
  nature: natureTheme,
  science: scienceTheme,
  cell: cellTheme,
  minimal: minimalTheme,
  colorblind: colorblindTheme,
  print: printTheme,
  dark: darkTheme
};

export type ThemeName = keyof typeof themes;

/**
 * Create a custom theme extending a base theme
 */
export function createTheme(config: Partial<Theme> & { extends?: ThemeName }): Theme {
  const baseTheme = config.extends ? themes[config.extends] : defaultTheme;
  
  return {
    ...baseTheme,
    ...config,
    colors: { ...baseTheme.colors, ...config.colors },
    typography: { ...baseTheme.typography, ...config.typography },
    spacing: { ...baseTheme.spacing, ...config.spacing },
    strokes: { ...baseTheme.strokes, ...config.strokes },
    radii: { ...baseTheme.radii, ...config.radii },
    accessibility: { ...baseTheme.accessibility, ...config.accessibility }
  } as Theme;
}

/**
 * Get a color from the theme's categorical palette
 */
export function getCategoryColor(theme: Theme, index: number): string {
  return theme.colors.palette[index % theme.colors.palette.length];
}

/**
 * Get a color from a sequential or diverging scale
 */
export function getScaleColor(scale: ColorScale, value: number): string {
  // value should be between 0 and 1
  const clamped = Math.max(0, Math.min(1, value));
  const index = Math.floor(clamped * (scale.colors.length - 1));
  return scale.colors[index];
}
