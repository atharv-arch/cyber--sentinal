/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#0f0f1a',
        'bg-card': '#13131f',
        'bg-card-hover': '#1a1a2e',
        'border-dim': '#1e1e3a',
        'border-bright': '#2d2d5e',
        'teal': '#00d4aa',
        'teal-dim': 'rgba(0,212,170,0.13)',
        'amber': '#f59e0b',
        'amber-dim': 'rgba(245,158,11,0.13)',
        'red-threat': '#ef4444',
        'red-dim': 'rgba(239,68,68,0.13)',
        'text-primary': '#e2e8f0',
        'text-secondary': '#94a3b8',
        'text-muted': '#475569',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-border': 'pulse-border 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink': 'blink 1.2s step-start infinite',
        'fade-in': 'fade-in 0.5s ease forwards',
        'gauge-fill': 'gauge-fill 1.5s ease-out forwards',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { boxShadow: '0 0 0 2px #ef4444' },
          '50%': { boxShadow: '0 0 0 6px rgba(239,68,68,0.2)' },
        },
        'blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
        'fade-in': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'glow': {
          from: { textShadow: '0 0 4px #00d4aa, 0 0 8px #00d4aa' },
          to: { textShadow: '0 0 8px #00d4aa, 0 0 20px #00d4aa, 0 0 40px rgba(0,212,170,0.4)' },
        },
      },
    },
  },
  plugins: [],
}
