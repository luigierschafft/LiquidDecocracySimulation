import type { Config } from 'tailwindcss'

/**
 * Design tokens — "Morgenlicht" (see docs/design-system/README.md).
 *
 * The neutral and lilac scales below deliberately REPLACE Tailwind's default
 * gray / purple / violet / indigo, so every existing `text-gray-500` or
 * `bg-purple-100` in the codebase picks up the calmer palette automatically.
 */
const neutral = {
  50: '#F7F8FA',
  100: '#F0F2F5',
  200: '#E4E7EC',
  300: '#CDD2DA',
  400: '#98A1AE',
  500: '#6B7482',
  600: '#4E5664',
  700: '#373E4A',
  800: '#242A33',
  900: '#171B22',
  950: '#0E1116',
}

// Soft dusk lilac — calmer than the neon default purple
const lilac = {
  50: '#F6F3FD',
  100: '#EDE7FB',
  200: '#DCD1F6',
  300: '#C4B2EE',
  400: '#A78DE2',
  500: '#8D6CD5',
  600: '#6E4FC4',
  700: '#5A40A3',
  800: '#493583',
  900: '#3C2D69',
  950: '#251A45',
}

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: neutral,
        purple: lilac,
        violet: lilac,
        indigo: lilac,
        background: '#F5F6F8',
        foreground: '#171B22',
        surface: '#FFFFFF',
        line: '#E4E7EC',
        accent: {
          DEFAULT: '#C2570C', // white text on it = 4.5:1
          hover: '#A84A09',
          light: '#FFB547',
          soft: '#FFF3E4',
        },
        sun: {
          100: '#FFF1DC',
          300: '#FFCB6B',
          400: '#FFB547',
          500: '#FF9F43',
          700: '#8A4A06',
          900: '#3B2300', // text on sun buttons (7:1+)
        },
        pro: { DEFAULT: '#1C7C54', soft: '#E6F5EE' },
        contra: { DEFAULT: '#C0384B', soft: '#FDECEE' },
        sky: { DEFAULT: '#2F66C9', soft: '#EAF1FD' },
        'auro-green': '#1C7C54',
        sand: '#E4E7EC',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        playful: ['var(--font-playful)', 'system-ui', 'sans-serif'],
        fun: ['var(--font-fun)', 'var(--font-playful)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,27,34,0.04), 0 2px 8px rgba(23,27,34,0.05)',
        lift: '0 2px 4px rgba(23,27,34,0.05), 0 10px 28px rgba(23,27,34,0.08)',
        // tactile "cushion" for playful buttons: a solid bottom edge
        cushion: '0 4px 0 rgba(138,74,6,0.28)',
        'cushion-white': '0 4px 0 rgba(23,27,34,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
