import { theme } from '../framework/theme';

function parseFontList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("'") || part.startsWith('"')) return part;
      if (/\s/.test(part)) return `'${part}'`;
      return part;
    });
}

const lightColors = {
  text: theme.colors.text,
  subtle: theme.colors.subtleText,
  surface: theme.colors.bg,
  panel: theme.colors.panel,
  bg: '#F3F4F6',
  border: theme.colors.grid,
  blue: theme.colors.blue,
  teal: theme.colors.teal,
  orange: theme.colors.orange,
  red: theme.colors.red
};

const darkColors = {
  text: '#F1F5F9',
  subtle: '#94A3B8',
  surface: '#0F172A',
  panel: '#1E293B',
  bg: '#020617',
  border: '#334155',
  blue: '#60A5FA',
  teal: '#2DD4BF',
  orange: '#FB923C',
  red: '#F87171'
};

export const studioTokens = {
  colors: lightColors,
  darkColors,
  radii: {
    control: `${theme.radii.md}px`,
    card: '14px'
  },
  shadows: {
    cardHover: '0 6px 18px rgba(17, 24, 39, 0.08)',
    figure: '0 10px 34px rgba(17, 24, 39, 0.16)'
  },
  fonts: {
    sans: parseFontList(theme.fontFamily),
    mono: parseFontList(theme.monoFontFamily)
  },
  transitions: {
    80: '80ms',
    150: '150ms'
  }
} as const;

