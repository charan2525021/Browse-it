import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        cream: {
          50: '#F7F4EE',
          100: '#F0EBE2',
          200: '#E8E0D4',
          300: '#D4C9B8',
        },
        bark: {
          DEFAULT: '#442D11',
          light: '#5C3D1E',
          dark: '#2E1E0A',
        },
        gold: {
          DEFAULT: '#F5CF63',
          light: '#F8DC85',
          dark: '#D4AD3A',
        },
        night: {
          DEFAULT: '#141413',
          light: '#1E1E1D',
          lighter: '#2A2A28',
        },
        navy: {
          950: '#020817',
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#141c35',
          600: '#1a2040',
          500: '#1e2850',
        },
        brand: {
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          green: '#10b981',
          orange: '#f59e0b',
          pink: '#ec4899',
          red: '#ef4444',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-card': 'linear-gradient(145deg, #0f1629 0%, #141c35 100%)',
        'gradient-glow': 'radial-gradient(ellipse at top, #6366f120 0%, transparent 60%)',
        'gradient-sidebar': 'linear-gradient(180deg, #0a0e1a 0%, #0f1629 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite',
        'count-up': 'countUp 0.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
        'typing': 'typing 1.2s steps(3) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 8px #6366f140' }, '50%': { boxShadow: '0 0 24px #6366f180, 0 0 40px #8b5cf640' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        borderFlow: { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
        countUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        bounceSubtle: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
        typing: { '0%': { content: '""' }, '33%': { content: '"."' }, '66%': { content: '".."' }, '100%': { content: '"..."' } },
      },
      boxShadow: {
        'glow-indigo': '0 0 20px #6366f140, 0 0 60px #6366f120',
        'glow-purple': '0 0 20px #8b5cf640, 0 0 60px #8b5cf620',
        'glow-cyan': '0 0 20px #06b6d440, 0 0 60px #06b6d420',
        'glow-green': '0 0 20px #10b98140',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)',
      },
      backdropBlur: { xs: '2px' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'Fira Code', 'monospace'] },
    },
  },
  plugins: [],
} satisfies Config
