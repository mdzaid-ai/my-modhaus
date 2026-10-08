/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        architectural: {
          black: '#0B0B0B',
          dark: '#121212',
          charcoal: '#1A1A1A',
          concrete: '#AAA7A0',
          concreteDark: '#55534F',
          offwhite: '#F1EEE7',
          beige: '#D6CAB9',
          rust: '#8A4E39',
          earth: '#684132',
          blueprint: '#48CAE4',
          blueprintBg: '#08121E',
          blueprintInk: '#1C3144',
          amber: '#E89D42',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'Menlo', 'monospace'],
        display: ['"Cabinet Grotesk"', '"Syne"', '"Monument Extended"', '"Helvetica Neue"', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      letterSpacing: {
        architectural: '0.2em',
        widest: '0.3em'
      }
    },
  },
  plugins: [],
}
