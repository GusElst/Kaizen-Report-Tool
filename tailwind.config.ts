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
        // Paleta de marca Kaizen
        brand: {
          DEFAULT: '#f26c09',
          50:  '#fff4ed',
          100: '#ffe8d5',
          200: '#fecba8',
          300: '#fda971',
          400: '#fb8038',
          500: '#f26c09',
          600: '#e35a00',
          700: '#bc4802',
          800: '#963a08',
          900: '#79310b',
          950: '#431705',
        },
        // Azul slate oscuro — color principal Kaizen
        slate: {
          brand: '#27333d',
        },
        // Fondos dark theme
        surface: {
          DEFAULT: '#0d1318',
          50:  '#111920',
          100: '#161f27',
          200: '#1c262f',
          300: '#27333d',  // brand slate
          400: '#364450',
          500: '#4a5d6a',
        },
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-roboto)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
