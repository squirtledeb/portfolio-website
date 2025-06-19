/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ocean-deep': 'var(--ocean-deep)',
        'ocean-surface': 'var(--ocean-surface)',
        'ocean-light': 'var(--ocean-light)',
        'ocean-accent': 'var(--ocean-accent)',
        'ocean-text': 'var(--ocean-text)',
        'ocean-text-secondary': 'var(--ocean-text-secondary)',
      },
      animation: {
        'wave': 'wave 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'wave-pulse': 'wave-pulse 5s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'wave-pulse': {
          '0%': { opacity: '0.1' },
          '60%': { opacity: '1' },
          '100%': { opacity: '0.1' },
        },
      },
    },
  },
  plugins: [],
} 