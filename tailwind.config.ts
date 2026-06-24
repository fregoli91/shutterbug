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
        ink: '#17231d',
        cream: '#faf7ef',
        sand: '#f6f2e8',
        brass: '#2f6f4e',
        charcoal: '#20382b',
        sage: '#dfead8',
        moss: '#24543a',
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