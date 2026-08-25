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
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
