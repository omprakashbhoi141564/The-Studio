import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#F4EFE6",
          surface: "#FAF6EF",
          accent: "#B75E2B",
          dark: "#1F1B16"
        }
      }
    }
  },
  plugins: []
};

export default config;
