/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          light: '#f5f5f5', // Light gray
          DEFAULT: '#808080', // Default gray
          dark: '#333333', // Dark gray
        },
      },
    },
  },
  plugins: [],
}

