module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#080612',
        accent: '#a855f7',
        gold: '#f59e0b',
        surface: '#0f0b1e',
        surface2: '#16112a',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}
