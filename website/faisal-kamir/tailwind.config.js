/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#151515',
        ivory: '#F7F4EE',
        paper: '#FFFFFF',
        gold: '#B08A4A',
        stone: '#77736D',
        goldlight: '#CBA968',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      letterSpacing: {
        widest2: '.25em',
      },
      maxWidth: {
        content: '1440px',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn .5s ease forwards',
        slideUp: 'slideUp .6s ease forwards',
        slideInRight: '.3s ease forwards slideInRight',
      },
    },
  },
  plugins: [],
}
