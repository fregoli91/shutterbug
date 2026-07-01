import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16231d',
        cream: '#fde9cd',
        sand: '#f7ddb8',
        forest: '#24543a',
        moss: '#2f6f4e',
        charcoal: '#20382b',
        sage: '#e6efd8',
        mint: '#f2f8ea',
        white: '#ffffff'
      },
      boxShadow: {
        soft: '0 24px 80px rgba(23, 35, 29, 0.10)'
      }
    }
  },
  plugins: []
};

export default config;
