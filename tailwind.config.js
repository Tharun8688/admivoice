/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        navy: { 950: '#070b1f', 900: '#0b1030', 800: '#111a44', 700: '#1a2560' },
        ink: { DEFAULT: '#0f172a', 2: '#334155', 3: '#64748b', 4: '#94a3b8' },
        line: { DEFAULT: '#e6e8f0', 2: '#eef0f6' },
        canvas: '#f6f7fb',
        brand: { 50: '#eef0ff', 100: '#e0e4ff', 200: '#c7ceff', 500: '#5b5bf0', 600: '#4f46e5', 700: '#4338ca' },
        violet2: { 50: '#f5f1ff', 100: '#ece5ff', 500: '#8b5cf6' },
        ok: { 50: '#ecfdf5', 500: '#10b981', 600: '#059669', 700: '#047857' },
        warn: { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        bad: { 50: '#fef2f2', 500: '#dc6262', 600: '#c24545', 700: '#a13636' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.04), 0 1px 1px rgba(15,23,42,.03)',
        pop: '0 12px 32px -8px rgba(15,23,42,.18), 0 2px 6px rgba(15,23,42,.06)',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'none' } },
        pulseRing: { '0%': { boxShadow: '0 0 0 0 rgba(16,185,129,.5)' }, '100%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        wave: { '0%,100%': { transform: 'scaleY(.35)' }, '50%': { transform: 'scaleY(1)' } },
      },
      animation: { fadeUp: 'fadeUp .25s ease-out both', pulseRing: 'pulseRing 1.6s infinite', wave: 'wave 1s ease-in-out infinite' },
    },
  },
  plugins: [],
}
