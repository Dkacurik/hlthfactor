import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      primary: '#D5EA0A',
      secondary: '#31009C',
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
    },
    spacing: {
      xl: '1280px',
    },
    fontSize: {
      xl: '3rem',
      l: '1.5rem',
      m: '1rem',
    }
  },
  plugins: [],
}
export default config
