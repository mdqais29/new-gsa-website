/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safety: {
          orange: '#EA580C',      // High-vis construction orange
          'orange-glow': '#F97316',
          amber: '#F59E0B',       // Hazard amber
          'amber-light': '#FEF3C7',
          yellow: '#EAB308',
        },
        midnight: {
          950: '#060D1A',
          900: '#0A192F',         // Deep midnight navy
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
        slatebase: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        syncopate: ['Syncopate', 'sans-serif'],
        unbounded: ['Unbounded', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-hover': '0 20px 40px -15px rgba(234, 88, 12, 0.2)',
        'glow-orange': '0 0 35px -5px rgba(234, 88, 12, 0.4)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.35)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)",
        'grid-pattern-dark': "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      }
    },
  },
  plugins: [],
}
