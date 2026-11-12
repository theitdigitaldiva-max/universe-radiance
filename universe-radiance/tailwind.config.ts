import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F5EFE9",
        lavender: "#D8C5D9",
        gold: "#C5A477",
        plum: "#8A718A",
        charcoal: "#42363E",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "80rem",
      },
    },
  },
  plugins: [],
};

export default config;
