/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Amiri', 'serif'],
      },
      fontSize: {
        'menu': ['0.9375rem', '1.375rem'],
      },
    },
  },
  plugins: [],
};