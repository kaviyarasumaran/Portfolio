import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        bg: "#0B0F19"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,.25), 0 0 60px rgba(59,130,246,.15)"
      }
    }
  },
  plugins: []
} satisfies Config;
