/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          bg:       '#070d1a',
          bg2:      '#0d1829',
          card:     '#111e34',
          card2:    '#162240',
          primary:  '#00c9a7',
          primary2: '#0099d9',
          green:    '#2ecc71',
          blue:     '#3498db',
          yellow:   '#f39c12',
          red:      '#e74c3c',
          purple:   '#9b59b6',
          muted:    '#7a90b8',
          dim:      '#4a607e',
        },
      },
      animation: {
        'fade-up':     'fadeUp 0.6s ease-out both',
        'bounce-in':   'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'spin-slow':   'spin 12s linear infinite',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
        'scan':        'scan 2s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'blink':       'blink 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          from: { opacity: '0', transform: 'scale(0) rotate(-30deg)' },
          to:   { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.06' },
          '50%':      { transform: 'scale(1.3)', opacity: '0.1' },
        },
        scan: {
          '0%':   { top: '0', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':      { transform: 'translateY(-20px) rotate(10deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00c9a7, #0099d9)',
        'gradient-mesh':
          'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0,201,167,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 20%, rgba(52,152,219,0.10) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
};
