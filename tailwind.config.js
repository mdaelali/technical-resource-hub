/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      colors: {
        ink: {
          950: '#03050d',
          900: '#070b1a',
          800: '#0c1228',
          700: '#141a33',
          600: '#1c2440'
        },
        accent: {
          violet: '#8b5cf6',
          cyan: '#22d3ee',
          emerald: '#34d399',
          gold: '#fcd34d'
        }
      },
      boxShadow: {
        glass: 'none',
        glow: 'none',
        'glow-cyan': 'none',
        'glow-gold': 'none',
        'inset-soft': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      },
      backdropBlur: {
        xs: '2px'
      },
      letterSpacing: {
        tightest: '-0.04em'
      }
    }
  },
  plugins: []
};
