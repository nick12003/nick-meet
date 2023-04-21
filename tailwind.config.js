const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */

const myUtilities = plugin(function ({ addUtilities }) {
  addUtilities({
    ".animationDelay-100": {
      "animation-delay": "0.1s",
    },
    ".animationDelay-200": {
      "animation-delay": "0.2s",
    },
  });
});

export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#562D80",
      },
      dropShadow: {
        primary: "0 0 1em #562D80",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        showToolTip: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        showDrawer: {
          "0%": { width: 0 },
          "100%": { width: "350px" },
        },
        hideDrawer: {
          "0%": { width: "350px" },
          "100%": { width: 0 },
        },
        Loading: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        LoadingText: {
          "0%": {
            "background-size": "200% 200%",
            "background-position": "200% center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "100% center",
          },
          "100%": {
            "background-size": "200% 200%",
            "background-position": "0% center",
          },
        },
      },
      animation: {
        showToolTip: "showToolTip 0.5s ease-in-out forwards",
        showDrawer: "showDrawer 0.2s ease-in-out forwards",
        hideDrawer: "hideDrawer 0.2s ease-in-out forwards",
        Loading: "Loading 0.5s ease-in-out infinite",
        LoadingText: "LoadingText 2s ease-in-out infinite",
      },
    },
  },
  plugins: [myUtilities],
};
