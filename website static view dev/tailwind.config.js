/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px', // Ultra-wide support
    },
    extend: {
      fontFamily: {
        sans: ['Gilroy', 'sans-serif'],
      },
      fontSize: {
        'fluid-h1': 'var(--font-h1)',
        'fluid-h2': 'var(--font-h2)',
        'fluid-h3': 'var(--font-h3)',
        'fluid-body': 'var(--font-body)',
        'fluid-label': 'var(--font-label)',
      },
      spacing: {
        'fluid-section': 'var(--spacing-section)',
        'fluid-card': 'var(--spacing-card)',
        'fluid-gap': 'var(--spacing-gap)',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
        'fluid': '90vw',
      },
      colors: {
        'teravolta': {
          'lime': '#c3d021',
          'lime-dark': '#A5B01A',
          'cyan': '#02a2b6',
          'navy': '#194271',
          'navy-dark': '#123154',
          'blue': '#004a90',
          'blue-dark': '#00376b',
          'brown': '#412614',
        },
      },
    },
  },
  plugins: [],
}

