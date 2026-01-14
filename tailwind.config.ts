import type { Config } from 'tailwindcss'

/**
 * Property Development Tracker - Tailwind Configuration
 *
 * This defines the brand design system used throughout the app.
 * Change values here to update styling globally.
 *
 * COLOUR USAGE:
 * - teal: Primary brand colour - headers, headings, primary UI elements
 * - coral: Accent colour - CTAs, buttons, icons, highlights
 * - ocean: Sidebar backgrounds, secondary sections
 * - electric: Emphasis/attention (What's Next prompts, planning scores)
 * - brand-grey: Muted sections (Site Context background)
 * - brand-offwhite: Page backgrounds
 * - brand-black: High-contrast sections (Recent Activity)
 *
 * BUTTON STYLES:
 * - Primary: bg-teal text-white, hover:bg-coral
 * - Secondary: border-coral text-coral, hover:bg-coral hover:text-white
 * - Ghost: text-coral hover:bg-coral/10
 *
 * CARD STYLES:
 * - White cards with no border-radius (sharp edges)
 * - Shadow for elevation
 *
 * HEADINGS:
 * - h1: text-2xl font-bold text-teal (page titles)
 * - h2: text-lg font-semibold text-teal (section headers)
 * - h3: text-lg font-semibold text-teal (card headers)
 * - On dark backgrounds: text-white
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
      // Consistent border radius - sharp edges for cards
      borderRadius: {
        'card': '0px',
        'button': '9999px', // Fully rounded buttons
        'badge': '9999px',  // Pill-shaped badges
      },
    },
  },
  plugins: [],
}

export default config
