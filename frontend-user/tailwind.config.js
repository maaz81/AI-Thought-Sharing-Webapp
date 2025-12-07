/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // 👈 important for dark mode

  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1200px",
          "2xl": "1440px",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      colors: {
        brand: {
          primary: "#2F80ED",
          primaryHover: "#2364BB",
          accent: "#F4A896",
          bg: "#F7F9FB",
          surface: "#FFFFFF",
          text: "#1C1C1C",
          muted: "#737373",
          border: "#E2E8F0",
        },
        brandDark: {
          bg: "#121518",
          surface: "#1C2024",
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

      transitionProperty: {
        bg: "background-color, border-color",
        colors: "color, background-color, border-color",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
