/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors - CYBER NOIR Theme
        primary: {
          DEFAULT: '#A855F7',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#A855F7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        secondary: {
          DEFAULT: '#EC4899',
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#EC4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        // Background Colors
        background: {
          DEFAULT: '#09090B',
          light: '#FAFAFA',
          dark: '#09090B',
        },
        surface: {
          DEFAULT: '#18181B',
          light: '#FFFFFF',
          dark: '#18181B',
        },
        card: {
          DEFAULT: '#1F1F23',
          light: '#FFFFFF',
          dark: '#1F1F23',
        },
        // Text Colors
        foreground: {
          DEFAULT: '#F4F4F5',
          light: '#18181B',
          dark: '#F4F4F5',
        },
        muted: {
          DEFAULT: '#A1A1AA',
          light: '#71717A',
          dark: '#A1A1AA',
          foreground: '#A1A1AA',
        },
        // Border Colors
        border: {
          DEFAULT: '#27272A',
          light: '#E4E4E7',
          dark: '#27272A',
        },
        // State Colors
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
          dark: '#22C55E',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF9C3',
          dark: '#F59E0B',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#EF4444',
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
          dark: '#0EA5E9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.15)',
        glow: '0 0 30px rgba(168, 85, 247, 0.35)',
        'glow-secondary': '0 0 30px rgba(236, 72, 153, 0.35)',
      },
      transitionTimingFunction: {
        'cyber': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
