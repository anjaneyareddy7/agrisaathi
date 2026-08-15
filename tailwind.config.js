/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        accent: '#FFC107',
        dark: '#1B5E20',
        light: '#E8F5E9',
      }
    },
  },
  plugins: [],
}
