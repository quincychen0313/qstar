/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zodiac: {
          fire: '#f87171',
          earth: '#34d399',
          air: '#38bdf8',
          water: '#818cf8',
          gold: '#fbbf24',
          dark: '#090d16',
          panel: '#111827',
          card: '#1a2234',
        },
        slate: {
          850: '#172033',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Songti TC', 'serif'],
      }
    },
  },
  plugins: [],
}
