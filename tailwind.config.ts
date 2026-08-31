import type { Config } from 'tailwindcss'

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
        brand: {
          white: '#ffffff',
          'off-white': '#fafafa',
          'light-gray': '#f4f4f5',
          'near-black': '#18181b',
          'dark-gray': '#3f3f46',
          'medium-gray': '#71717a',
          'light-gray-text': '#a1a1aa',
          charcoal: '#27272a',
          zinc: '#52525b',
          'border-gray': '#e4e4e7',
        },
        teal: {
          primary: '#0f766e',
          medium: '#0d9488',
          pale: '#ccfbf1',
        },
        amber: {
          accent: '#b45309',
          light: '#fef3c7',
          badge: '#d97706',
        },
        category: {
          crypto: '#7c3aed',
          'crypto-bg': '#f5f3ff',
          economy: '#0f766e',
          'economy-bg': '#ccfbf1',
          markets: '#16a34a',
          'markets-bg': '#dcfce7',
          banking: '#d97706',
          'banking-bg': '#fef3c7',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'card-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

export default config
