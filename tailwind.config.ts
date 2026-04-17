import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#3D1A6E',
        'mid-purple': '#6B3FA0',
        lavender: '#9B7FC7',
        'lavender-light': '#E8E0F5',
        cream: '#FDFAF7',
        'text-primary': '#1C0F2E',
        'text-secondary': '#4A3560',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
