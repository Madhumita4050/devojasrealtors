/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2557',
          dark: '#080f2b',
          mid: '#0d1d47',
          light: '#1e3a8a',
          muted: '#2563eb'
        },
        gold: {
          // Replaced yellow with modern Royal & Electric Sky Blue
          DEFAULT: '#2563EB',
          light: '#38BDF8',
          dark: '#1D4ED8'
        },
        royal: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a'
        },
        surface: {
          DEFAULT: '#111c3a',
          card: '#162040',
          border: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)' }, '50%': { boxShadow: '0 0 24px rgba(56, 189, 248, 0.7)' } },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'glow-gold': '0 0 20px rgba(37, 99, 235, 0.35)',
        'glow-blue': '0 0 24px rgba(37, 99, 235, 0.45)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }
    },
  },
  plugins: [],
}
