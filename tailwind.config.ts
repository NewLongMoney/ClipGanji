import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#060809",
        ink: "#0E1214",
        green: {
          DEFAULT: "#00C853",
          dim: "#00A844",
          bg: "#E8F9EE",
        },
        gold: {
          DEFAULT: "#F5B800",
          dim: "#C99600",
        },
        white: "#FFFFFF",
        gray: {
          DEFAULT: "#4A5259",
          light: "#8A949C",
          bg: "#F2F2F2",
        },
        card: "#141414",
        border: "#1E2428",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        anton: ["var(--font-anton)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      lineHeight: {
        relaxed: '1.65',
      }
    },
  },
  plugins: [],
};
export default config;
