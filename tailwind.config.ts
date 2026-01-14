import type { Config } from 'tailwindcss'

/**
 * Tailwind Configuration with Wildstone Brand Colours
 *
 * This defines custom colours that can be used throughout the app:
 * - bg-coral, text-coral, border-coral, etc.
 * - bg-teal, text-teal, border-teal, etc.
 *
 * Change a colour here and it updates everywhere.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colours
        teal: {
          DEFAULT: '#1e434d',
          light: '#2a5a66',
          dark: '#152f36',
        },
        coral: {
          DEFAULT: '#fa6e60',
          light: '#fb8a7f',
          dark: '#e85a4d',
        },

        // Section/background colours
        ocean: {
          DEFAULT: '#0078a0',
          light: '#0091c2',
          dark: '#005f80',
        },
        electric: {
          DEFAULT: '#007aee',
          light: '#3399ff',
          dark: '#0062be',
        },

        // Neutral colours with semantic names
        'brand-grey': '#6b7280',
        'brand-offwhite': '#f8f8f8',
        'brand-black': '#000000',
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
