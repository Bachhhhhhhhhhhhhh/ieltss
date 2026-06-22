/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        accent: {
          teal: '#14B8A6',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'border-flow': 'border-flow 4s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-24px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(20, 184, 166, 0.5)',
        'glow-indigo': '0 0 40px -10px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 60px -15px rgba(20, 184, 166, 0.6)',
        premium: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};