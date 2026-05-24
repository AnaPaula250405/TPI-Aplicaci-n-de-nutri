/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8f0',
          100: '#feecd6',
          200: '#fcd3a0',
          300: '#f9b366',
          400: '#f5922e',
          500: '#e07020',
          600: '#c45a14',
          700: '#9e4410',
          800: '#7a3310',
          900: '#5c2710',
        },
        earth: {
          50:  '#fdf6ed',
          100: '#f7e8ce',
          200: '#edcc94',
          300: '#e0a854',
          400: '#d4852a',
          500: '#b86a18',
          600: '#935314',
          700: '#703d12',
          800: '#502d0e',
          900: '#361e09',
        },
        cream: '#fdf8f2',
        sand:  '#f2e8d5',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body:    ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'serif'],
      },
    },
  },
  plugins: [],
}
