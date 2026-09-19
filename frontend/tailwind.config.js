/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        studio: {
          black: "#070707",
          dark: "#0D0D0D",
          charcoal: "#151515",
          red: "#E50914",
          redDark: "#A6070F",
          white: "#F5F5F5",
          muted: "#858585"
        }
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },

      letterSpacing: {
        tighter2: "-0.06em"
      },

      maxWidth: {
        studio: "1600px"
      }
    }
  },

  plugins: []
};