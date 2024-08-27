const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      primary: '#223642',
      primarydark: '#46A5A5',
      accent: '#c4681a',
      darkblue: '#212539',
      deepblue: '#132A3E',
      lightblue: '#028FE3',
      yellow5: '#FFB761',
      prbred: '#dc481e',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1100px',
      xl: '1600px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
