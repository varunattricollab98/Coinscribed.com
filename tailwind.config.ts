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

        /* Electric-blue brand accent — modern fintech energy for hero,
           gradients, links, live data and interactive highlights. */
        accent: {
          DEFAULT: '#2563EB', // primary electric blue
          hover: '#1D4ED8', // darker for hover/pressed
          light: '#60A5FA', // dark-mode / lightened
          soft: '#DBEAFE', // subtle tinted backgrounds
          cyan: '#06B6D4', // gradient partner
        },

        /* Antique brass — the "royal" ornament tone. Reserved for editorial
           furniture: section rules, featured badges, drop caps and pull-quote
           marks. Desaturated on purpose; this is gilt on paper, not neon. */
        gold: {
          DEFAULT: '#9C7B3C',
          light: '#C2A25E',
          lighter: '#DCC894',
          soft: '#F5EEDF',
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

      /* These MUST lead with the `next/font` CSS variables set on <html> in
         app/layout.tsx. Naming the families literally makes the browser look
         for a locally installed copy and silently fall back to Georgia — the
         self-hosted woff2 files are shipped but never used, which is exactly
         the bug this stack had. The literal names stay as a second step for
         the rare machine that does have them installed. */
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },

      /* Editorial type scale. Display sizes carry tight leading and optical
         negative tracking; `display-hero` exists for the single largest
         headline on a page (lead story, article title) so the step down to
         `display-1` stays visible. */
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1.1', letterSpacing: '0.16em' }],
        caption: ['0.75rem', { lineHeight: '1.45' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.75' }],
        'display-hero': ['4rem', { lineHeight: '0.98', letterSpacing: '-0.028em' }],
        'display-0': ['3.25rem', { lineHeight: '1.02', letterSpacing: '-0.024em' }],
        'display-1': ['2.5rem', { lineHeight: '1.04', letterSpacing: '-0.021em' }],
        'display-2': ['2rem', { lineHeight: '1.08', letterSpacing: '-0.018em' }],
        'display-3': ['1.5rem', { lineHeight: '1.12', letterSpacing: '-0.014em' }],
        'display-4': ['1.1875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },

      /* Layered surfaces instead of drop shadows. These are deliberately at
         the threshold of perception — they read as paper lifting off paper,
         never as a floating card. */
      boxShadow: {
        soft: '0 1px 2px rgba(11,11,12,0.04), 0 2px 8px -2px rgba(11,11,12,0.05)',
        lift: '0 2px 4px rgba(11,11,12,0.04), 0 12px 28px -12px rgba(11,11,12,0.14)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
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

      backgroundImage: {
        'accent-gradient':
          'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
        /* Gilt rule used under section eyebrows and around featured badges. */
        'gold-gradient':
          'linear-gradient(90deg, #9C7B3C 0%, #DCC894 50%, #9C7B3C 100%)',
        'hero-radial':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18), transparent 70%)',
        'hero-radial-dark':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(96,165,250,0.14), transparent 70%)',
        /* Bottom-up scrim so headline text stays legible over photography. */
        scrim:
          'linear-gradient(to top, rgba(11,11,12,0.88) 0%, rgba(11,11,12,0.55) 32%, rgba(11,11,12,0.12) 62%, rgba(11,11,12,0) 100%)',
        'scrim-soft':
          'linear-gradient(to top, rgba(11,11,12,0.55) 0%, rgba(11,11,12,0.14) 45%, rgba(11,11,12,0) 100%)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
      transitionTimingFunction: {
        /* A calm, expensive-feeling ease used for hovers and reveals. */
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
