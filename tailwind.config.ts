import type { Config } from 'tailwindcss';
import { studioTokens } from './src/studio/design-tokens';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          ...studioTokens.colors,
          ...studioTokens.darkColors
        }
      },
      borderRadius: {
        control: studioTokens.radii.control,
        card: studioTokens.radii.card
      },
      boxShadow: {
        cardHover: studioTokens.shadows.cardHover,
        figure: studioTokens.shadows.figure
      },
      fontFamily: {
        sans: studioTokens.fonts.sans,
        mono: studioTokens.fonts.mono
      },
      transitionDuration: {
        80: studioTokens.transitions[80],
        150: studioTokens.transitions[150]
      }
    }
  },
  plugins: []
} satisfies Config;

