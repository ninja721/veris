import type { Config } from 'tailwindcss'

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Old Newspaper Theme Colors
        paper: {
          50: '#fdfbf7',
          100: '#f9f4e6',
          200: '#f0e6cc',
          300: '#e6d5aa',
          400: '#dcc488',
          500: '#d2b46e',
          600: '#a89058',
          700: '#7e6c42',
          800: '#54482c',
          900: '#2a2416',
        },
        ink: {
          50: '#f2f2f2',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#a6a6a6',
          400: '#8c8c8c',
          500: '#737373',
          600: '#595959',
          700: '#404040',
          800: '#262626',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        tech: {
          cyan: '#00f3ff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Courier Prime', 'monospace'],
        sans: ['Merriweather', 'serif'], // Default sans to serif for this theme
      },
      transitionDuration: {
        '600': '600ms',
        '800': '800ms',
      },
      transitionProperty: {
        'transform': 'transform',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
