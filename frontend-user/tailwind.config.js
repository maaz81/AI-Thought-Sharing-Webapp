/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // 👈 important for dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2F80ED", // main blue
          primaryHover: "#2364BB",
          accent: "#F4A896", // peach accent
          bg: "#F7F9FB", // page background
          surface: "#FFFFFF", // cards, navbar
          text: "#1C1C1C", // main text
          muted: "#737373", // secondary text
          border: "#E2E8F0", // soft borders
        },
        brandDark: {
          bg: "#121518", // dark background
          surface: "#1C2024", // dark surface
          text: "#FFFFFF",
          muted: "#A3A9B0",
          border: "#2D333A",
        },
        state: {
          success: "#6FCF97",
          warning: "#F2C94C",
          error: "#EB5757",
          info: "#56CCF2",
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
