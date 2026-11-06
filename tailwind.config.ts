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
          bg: "rgb(var(--bg-light-rgb) / <alpha-value>)",
          warm: "rgb(var(--bg-warm-rgb) / <alpha-value>)",
          peach: "rgb(var(--accent-peach-rgb) / <alpha-value>)",
          pink: "rgb(var(--accent-pink-rgb) / <alpha-value>)",
          mint: "rgb(var(--accent-mint-rgb) / <alpha-value>)",
          lavender: "rgb(var(--accent-lavender-rgb) / <alpha-value>)",
          sky: "rgb(var(--accent-sky-rgb) / <alpha-value>)",
          yellow: "rgb(var(--accent-yellow-rgb) / <alpha-value>)",
          gold: "#f0a830",
          coral: "#ff7b89",
          bamboo: "rgb(var(--accent-bamboo-rgb) / <alpha-value>)",
          card: "rgb(var(--bg-card-rgb) / <alpha-value>)",
          dark: "rgb(var(--text-dark-rgb) / <alpha-value>)",
          soft: "rgb(var(--text-soft-rgb) / <alpha-value>)",
          border: "rgb(var(--text-dark-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "Quicksand", "sans-serif"],
        display: ["var(--font-quicksand)", "Quicksand", "sans-serif"],
      },
      boxShadow: {
        retro: "4px 4px 0 rgb(var(--text-dark-rgb))",
        "retro-sm": "2px 2px 0 rgb(var(--text-dark-rgb))",
        "retro-lg": "8px 8px 0 rgba(var(--text-dark-rgb), 0.25)",
        "retro-mint": "4px 4px 0 rgb(var(--accent-mint-rgb))",
        "retro-pink": "4px 4px 0 rgb(var(--accent-pink-rgb))",
        "retro-bamboo": "4px 4px 0 rgb(var(--accent-bamboo-rgb))",
        "retro-lavender": "4px 4px 0 rgb(var(--accent-lavender-rgb))",
        "retro-dark": "6px 6px 0 rgb(var(--text-dark-rgb))",
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
