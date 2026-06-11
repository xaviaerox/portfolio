/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        space: ['var(--font-space-mono)', 'monospace'],
      },
      colors: {
        brand: {
          dark: '#05050f',
          accent: '#6366f1', // Indigo
          secondary: '#06b6d4', // Cyan
        }
      }
    },
  },
  plugins: [],
}
