/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#070A11',
          900: '#0E1422',
          850: '#151D30',
          800: '#1C2640',
          700: '#2A385C',
          600: '#3D5080',
          500: '#536DA8',
        },
        cyan: {
          400: '#38BDF8',
          500: '#06B6D4',
          600: '#0891B2',
          900: '#164E63',
        },
        emerald: {
          500: '#10B981',
          900: '#064E3B',
        },
        amber: {
          500: '#F59E0B',
          900: '#78350F',
        },
        rose: {
          500: '#F43F5E',
          900: '#881337',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan 3s linear infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
