/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { ink: '#1A1A2E', paper: '#FCFCFD' },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', '"Noto Sans JP"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(26,26,46,0.08)',
        'card-hover': '0 8px 32px 0 rgba(26,26,46,0.16)',
      },
      keyframes: {
        blob: { '0%, 100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(30px,-50px) scale(1.1)' }, '66%': { transform: 'translate(-20px,20px) scale(0.9)' } },
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'modal-in': { '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' }, '100%': { opacity: '1', transform: 'scale(1) translateY(0)' } },
      },
      animation: {
        blob: 'blob 8s infinite ease-in-out',
        'fade-in': 'fade-in 0.4s ease-out both',
        'modal-in': 'modal-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
