/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-dark': '#1d4ed8',
        surface: '#1e293b',
        'surface-light': '#f1f5f9',
      },
    },
  },
  plugins: [],
}
