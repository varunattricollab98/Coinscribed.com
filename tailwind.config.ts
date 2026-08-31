import type { Config } from 'tailwindcss'

/**
 * "Ink & Oxblood" — an executive/institutional design language.
 *
 * Principles encoded here:
 *   - Warm paper background, white surfaces, ink text. No pure-white page.
 *   - Hairlines instead of shadows: the box-shadow scale is intentionally absent.
 *   - Sharp corners: the radius scale is clamped to 0-2px (only `full` survives,
 *     for tiny list bullets).
 *   - A single accent (oxblood) used sparingly for links, CTAs and accent rules.
 *   - Up/down values use muted, print-like green/red — never bright signal colours.
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        paper: '#FBF9F6', // light page background (warm off-white print stock)
        surface: '#FFFFFF', // light cards/panels sitting on paper
        graphite: '#111113', // dark page background
        elevated: '#18181A', // dark cards/panels
        wash: {
          DEFAULT: '#F4F1EB', // subtle light hover/zebra tint
          dark: '#1D1D20', // subtle dark hover/zebra tint
        },

        /* Text */
        ink: {
          DEFAULT: '#0B0B0C', // headlines, primary text
          body: '#3A3A3C', // body copy
          muted: '#6E6E73', // captions, timestamps, secondary text
          inverse: '#F2EFEA', // dark-mode headlines (paper-tinted)
          'inverse-body': '#C7C2BA', // dark-mode body copy
          'inverse-muted': '#8B867E', // dark-mode captions
        },

        /* Rules, borders, dividers */
        hairline: {
          DEFAULT: '#E3E0DB',
          dark: '#2A2A2C',
        },

        /* The single accent. Target well under ~5% of any screen. */
        oxblood: {
          DEFAULT: '#7B2D26',
          light: '#A8443C', // lightened for dark-mode surfaces and accent rules
          lighter: '#C9645A', // AA-legible small text on graphite
        },

        /* Directional values only — never decorative. */
        up: {
          DEFAULT: '#1F6F4A',
          light: '#4E9B75', // dark-mode adjusted
        },
        down: {
          DEFAULT: '#9B2C2C',
          light: '#C56B68', // dark-mode adjusted
        },

        /* Desaturated, ink-adjacent category tones. Print-like, no pastels. */
        category: {
          crypto: '#514B63', // muted aubergine
          'crypto-light': '#9B94B5',
          economy: '#4A5A45', // muted olive
          'economy-light': '#9AAE93',
          markets: '#3B5266', // muted steel blue
          'markets-light': '#8CA6BE',
          banking: '#6B5540', // muted sepia
          'banking-light': '#BFA484',
          neutral: '#5A554E', // safe default
          'neutral-light': '#B0AAA1',
        },
      },

      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      /* Denser editorial type scale: tight leading on display sizes, a clear
         step-down through section headings, card titles, body and captions. */
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1.1', letterSpacing: '0.16em' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
        'display-0': ['3.25rem', { lineHeight: '1.02', letterSpacing: '-0.024em' }],
        'display-1': ['2.5rem', { lineHeight: '1.04', letterSpacing: '-0.021em' }],
        'display-2': ['2rem', { lineHeight: '1.08', letterSpacing: '-0.018em' }],
        'display-3': ['1.5rem', { lineHeight: '1.12', letterSpacing: '-0.014em' }],
        'display-4': ['1.1875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },

      /* Sharp corners. `full` is kept only for 2-3px list bullets. */
      borderRadius: {
        none: '0',
        sm: '1px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        '2xl': '2px',
        '3xl': '2px',
        full: '9999px',
      },

      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
