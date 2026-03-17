import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy:      { DEFAULT: '#1e3a5f', dark: '#0f1f35', deep: '#0a1628' },
        gold:      { DEFAULT: '#c9973a', light: '#e0b460', pale: '#f5e6c8' },
        'blue-mid': '#2d6a9f',
        cream:     { DEFAULT: '#faf9f7', dark: '#f0ede8' },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      boxShadow: {
        gold: '0 0 0 2px rgba(201,151,58,0.35)',
        card: '0 4px 16px rgba(30,58,95,0.10), 0 2px 6px rgba(30,58,95,0.06)',
        'card-lg': '0 12px 40px rgba(30,58,95,0.14), 0 4px 12px rgba(30,58,95,0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
