/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        accent:  "#7c5cfc",
        accent2: "#c084fc",
        accent3: "#06d6a0",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
      backgroundImage: {
        "grad-purple": "linear-gradient(120deg, #7c5cfc, #c084fc 50%, #06d6a0)",
      },
    },
  },
  plugins: [],
};
