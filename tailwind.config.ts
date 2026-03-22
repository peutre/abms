import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette ABMS — thème nature/botanique
        foret: {
          50:  '#f0f4e8',
          100: '#d8e6c0',
          200: '#b8d190',
          300: '#8fb85a',
          400: '#6ba030',
          500: '#4d8a1a',
          600: '#3a7012',
          700: '#2D5016', // vert forêt principal
          800: '#213d10',
          900: '#162a0a',
        },
        terre: {
          50:  '#fdf8ee',
          100: '#f8edcc',
          200: '#f0d898',
          300: '#e5be5c',
          400: '#d9a332',
          500: '#c78a1c',
          600: '#a66e14',
          700: '#8B6914', // terre principale
          800: '#6b4e0f',
          900: '#4a360a',
        },
        beige: {
          50:  '#fdfcf9',
          100: '#F5F0E8', // beige principal
          200: '#e8dfc8',
          300: '#d5c8a0',
          400: '#bfad76',
          500: '#a89252',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tailles augmentées pour accessibilité senior
        'base': ['1.125rem', { lineHeight: '1.7' }],  // 18px (vs 16px standard)
        'sm':   ['1rem',     { lineHeight: '1.6' }],   // 16px
        'lg':   ['1.25rem',  { lineHeight: '1.6' }],
        'xl':   ['1.5rem',   { lineHeight: '1.5' }],
        '2xl':  ['1.875rem', { lineHeight: '1.4' }],
        '3xl':  ['2.25rem',  { lineHeight: '1.3' }],
        '4xl':  ['3rem',     { lineHeight: '1.2' }],
      },
      spacing: {
        // Zones de clic minimum 48px pour WCAG (seniors)
        'touch': '3rem', // 48px
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(45, 80, 22, 0.08)',
        'card-hover': '0 8px 24px rgba(45, 80, 22, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
