/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4f9',
          100: '#dde5f2',
          200: '#c0d0e6',
          300: '#94b3d5',
          400: '#6290c0',
          500: '#3f72a9',
          600: '#2f598b',
          700: '#274771',
          800: '#1e385c',
          900: '#14253e',
          950: '#0d1728', // Deep navy
        },
        navy: {
          sidebar: '#0d1728',
          card: '#111e38',
          dark: '#0a1220'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
