import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: "#fef9e7",
          warm: "#fff5e6",
          peach: "#ffdab9",
          pink: "#ffb6c1",
          mint: "#c0f0dd",
          lavender: "#e2d1ff",
          sky: "#a0d4ff",
          yellow: "#ffd966",
          gold: "#ffaa33",
          coral: "#ff7b72",
          card: "#ffffffea",
          dark: "#3d3d3d",
          soft: "#6b5e4a",
          border: "#3d3d3d",
        },
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "Quicksand", "sans-serif"],
        display: ["var(--font-quicksand)", "Quicksand", "sans-serif"],
      },
      boxShadow: {
        retro: "4px 4px 0 #3d3d3d",
        "retro-sm": "2px 2px 0 #3d3d3d",
        "retro-lg": "8px 8px 0 rgba(61, 61, 61, 0.25)",
        "retro-mint": "4px 4px 0 #c0f0dd",
        "retro-pink": "4px 4px 0 #ffb6c1",
        "retro-lavender": "4px 4px 0 #e2d1ff",
        "retro-dark": "6px 6px 0 #3d3d3d",
      },
      borderRadius: {
        retro: "24px 8px 24px 8px",
        "retro-sm": "16px 4px 16px 4px",
        "retro-lg": "32px 12px 32px 12px",
      },
      animation: {
        "float-slow": "float 14s infinite ease-in-out",
        "float-medium": "float 10s infinite ease-in-out",
        "float-fast": "float 7s infinite ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-24px) translateX(16px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
