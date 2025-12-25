/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        notion: {
          bg: '#191919',
          'bg-secondary': '#2e2e2e',
          'bg-tertiary': '#3a3a3a',
          surface: '#2e2e2e',
          border: '#3a3a3a',
          text: '#ffffff',
          'text-secondary': '#e0e0e0',
          'text-muted': '#9ca3af',
          blue: '#2563eb',
          'blue-hover': '#1d4ed8',
          accent: '#ff6b35',
        },
      },
      spacing: {
        'notion': '96px', // Notion's typical max content width
      },
    },
  },
  plugins: [],
}

