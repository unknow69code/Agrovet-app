// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        // Keep existing if any
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: { // Add this new shadow definition
        'glow': '0 0 15px rgba(0, 255, 255, 0.4), 0 0 30px rgba(0, 255, 255, 0.2)', // Cyan glow
      },
      keyframes: {
        blob: { // Existing blob animation (you might rename the old one if needed, or update this one)
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'blob-lg': { // NEW: For larger, slower blob movement
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(50px, -80px) scale(1.2)' },
          '66%': { transform: 'translate(-40px, 60px) scale(0.95)' },
        },
        'pulse-light': {
          '0%, 100%': { filter: 'brightness(100%)' },
          '50%': { filter: 'brightness(150%)' },
        }
      },
      animation: {
        blob: 'blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        'blob-lg': 'blob-lg 15s infinite cubic-bezier(0.4, 0, 0.2, 1)', // Slower, larger movement
        'pulse-light': 'pulse-light 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
};
export default config;