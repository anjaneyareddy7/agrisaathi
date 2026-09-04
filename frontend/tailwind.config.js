/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        secondary: "#15803d",
        leaf: {
          50: "#f2faf3",
          100: "#e0f4e3",
          200: "#c2e8ca",
          300: "#93d5a4",
          400: "#5cba77",
          500: "#359d56",
          600: "#247f44",
          700: "#1e6538",
          800: "#1b512f",
          900: "#174328",
          950: "#0a2415",
        },
        harvest: {
          50: "#fdf9ec",
          100: "#faf0cd",
          200: "#f5df94",
          300: "#efc95b",
          400: "#eab32e",
          500: "#dd9417",
          600: "#c56f14",
          700: "#a44f16",
          800: "#8a3f18",
          900: "#773518",
        },
        cream: "#fbfaf3",
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgb(23 67 40 / 0.10)",
        lift: "0 12px 40px -8px rgb(23 67 40 / 0.18)",
        glow: "0 0 0 1px rgb(53 157 86 / 0.15), 0 8px 32px -6px rgb(53 157 86 / 0.35)",
      },
      backgroundImage: {
        "hero-grad": "linear-gradient(175deg, #f2faf3 0%, #e7f4e6 45%, #dcf0da 100%)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "floaty-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1.5deg)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "floaty-slow": "floaty-slow 9s ease-in-out infinite",
        ticker: "ticker 36s linear infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
}
