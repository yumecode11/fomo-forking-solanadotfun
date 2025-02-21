import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "#9648fe",
        secondary: "#65b7bc",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            default: '#9648fe',
            foreground: '#fff',
          },
          secondary: {
            default: '#65b7bc',
            foreground: '#fff',
          },
        },
      },
      dark: {
        colors: {
          primary: {
            default: '#9648fe',
            foreground: '#fff',
          },
          secondary: {
            default: '#65b7bc',
            foreground: '#fff',
          },
        },
      },
    },
  })],
}
