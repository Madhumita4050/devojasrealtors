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
          navy: '#0F2C2A',
          navyLight: '#16423F',
          gold: '#E6A863',
          goldLight: '#F3D1A5',
          dark: '#071514',
        }
      },
      boxShadow: {
        glow: '0 22px 70px rgba(10, 17, 40, 0.25)',
        lift: '0 18px 45px rgba(197, 160, 89, 0.15)',
      },
      animation: {
        floatSlow: 'floatSlow 7s ease-in-out infinite',
        fadeUp: 'fadeUp .7s ease-out both',
        shimmer: 'shimmer 8s linear infinite',
        marquee: 'marquee 25s linear infinite',
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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
