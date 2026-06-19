/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF9F6',
        surface: '#FFFFFF',
        'surface-alt': '#F2F0EA',
        ink: '#1A1A1A',
        muted: '#6B6B6B',
        border: '#E8E6E0',
        accent: '#E07A5F',
        'accent-deep': '#C75D43',
        teal: '#2A9D8F',
        danger: '#D1495B',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        card: '0 1px 3px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.07)',
        hover: '0 4px 6px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.10)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      lineHeight: {
        relaxed: '1.6',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
      },
    },
  },
  plugins: [],
}
