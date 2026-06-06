import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Light theme semantic tokens (the app is light-mode only) ---
        page: '#F6F1E7', // warm cream page background
        card: '#FFFFFF', // primary card surface
        surface: '#FBF6EC', // soft secondary surface
        fg: '#1A1611', // primary text (warm near-black)

        // --- Literal palette (kept for special sections + text-on-accent) ---
        cream: '#F4EFE6', // light text (used on dark footer / over photos)
        sand: '#EDE4D3',
        ink: '#0B0B0C', // deep ink — dark footer bg + dark text on yellow CTAs
        coal: '#141414',
        graphite: '#1E1E1F',
        // Brand accents from the reference designs
        butter: '#F5D547', // signature yellow CTA
        ember: '#E8622C', // orange delivery card
        grape: '#7C3AED', // purple section
        azure: '#2D7FF9', // blue section
        wine: '#7A1F2B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        marquee: 'marquee 28s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
