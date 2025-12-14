/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FFD700', // Main Neon Gold
          500: '#E6C200', // Slightly darker for hovers
          glow: 'rgba(255, 215, 0, 0.5)', // For glow effects
        },
        dark: {
          900: '#000000', // Pure Black
          800: '#121212', // Card Background
          700: '#1E1E1E', // Input Background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Make sure to import Inter in your index.css or HTML
      }
    },
  },
  plugins: [],
}