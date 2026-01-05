/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        genius: {
          // The "Void" Palette (Deep Space)
          base: '#020420',       // Main Background (Deepest Blue-Black)
          surface: '#0f172a',    // Card Background
          hover: '#1e293b',      // Hover State
          border: '#1e293b',     // Border Color
          
          // Brand Colors
          accent: '#00dc82',     // Growth Green (Hero Color)
          secondary: '#3b82f6',  // Tech Blue
          purple: '#7c3aed',     // AI Purple
          
          muted: '#94a3b8',      // Text Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 3s infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translate(-50%, -20px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #00dc8220' },
          '50%': { boxShadow: '0 0 20px #00dc8250' },
        }
      }
    },
  },
  plugins: [],
}