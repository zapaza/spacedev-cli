import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#050607',
          deep: '#0B0F10',
          panel: '#0E1512',
        },
        neon: {
          primary: 'var(--neon-primary)',
          soft: 'var(--neon-soft)',
          dim: 'var(--neon-dim)',
          glow: 'var(--neon-glow)',
        },
        crt: {
          shadow: '#02130A',
        },
        system: {
          error: '#FF4D4D',
          warning: '#FFC857',
          cyan: '#00E5FF',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        crt: '0.5px',
      },
      lineHeight: {
        crt: '1.6',
      },
      animation: {
        flicker: 'flicker 0.15s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'panel-appear': 'panel-appear 0.6s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.985' },
        },
        'glow-pulse': {
          '0%, 100%': {
            textShadow: '0 0 4px var(--neon-primary), 0 0 8px var(--neon-primary)',
          },
          '50%': {
            textShadow: '0 0 8px var(--neon-primary), 0 0 16px var(--neon-primary)',
          },
        },
        'panel-appear': {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      }
    },
  },
  plugins: [],
} satisfies Config
