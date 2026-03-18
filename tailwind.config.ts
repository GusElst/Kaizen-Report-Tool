import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Kaizen
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bcfd',
          400: '#8198fb',
          500: '#6272f6',
          600: '#4f52ea',
          700: '#4241cf',
          800: '#3636a7',
          900: '#313284',
          950: '#1e1d4e',
        },
        // Grises para dark theme
        surface: {
          DEFAULT: '#0f0f14',
          50:  '#1a1a24',
          100: '#22222e',
          200: '#2d2d3d',
          300: '#3a3a4d',
          400: '#4a4a60',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
