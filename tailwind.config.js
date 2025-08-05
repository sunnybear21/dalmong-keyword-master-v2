
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#1e40af', // blue-800
        'brand-secondary': '#3b82f6', // blue-500
        'brand-accent': '#2dd4bf', // teal-400
        'dark-bg': '#0f172a', // slate-900
        'dark-card': '#1e293b', // slate-800
        'dark-border': '#334155', // slate-700
        'dark-text': '#f1f5f9', // slate-100
        'dark-text-secondary': '#94a3b8', // slate-400
      }
    },
  },
  plugins: [],
}