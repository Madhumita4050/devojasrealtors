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
          navy: '#12372A',
          navyLight: '#1E5B47',
          gold: '#D7A43B',
          goldLight: '#F4C766',
          dark: '#071812',
        }
      },
      boxShadow: {
        glow: '0 22px 70px rgba(18, 55, 42, 0.16)',
        lift: '0 18px 45px rgba(47, 36, 18, 0.12)',
      },
      animation: {
        floatSlow: 'floatSlow 7s ease-in-out infinite',
        fadeUp: 'fadeUp .7s ease-out both',
        shimmer: 'shimmer 8s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}
