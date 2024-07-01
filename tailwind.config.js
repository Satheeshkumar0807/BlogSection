/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.html', './src/**/*.js', './src/**/*.jsx' , './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    extend: {
      keyframes: {
        bounceOnce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        bounceOnce: 'bounceOnce 1s forwards',
      }
    },
  },
  plugins: [],
}

