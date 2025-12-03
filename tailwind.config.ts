import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cc: {
          teal: "#2F7379",
          "teal-dark": "#246C6C",
          lime: "#ABCA20",
          "lime-soft": "#D7E77C",
          coral: "#FF6F61",
          "blue-pill": "#D9E4FF",
          "blue-pill-text": "#3056D3",
          "red-pill": "#FF4A4A",
          "green-good": "#36A852",
          bg: "#F9FAFB",
          surface: "#FFFFFF",
          "surface-soft": "#E9FBF7",
          "border-subtle": "#E5E7EB",
          "border-strong": "#D1D5DB",
          "text-main": "#111827",
          "text-muted": "#6B7280",
          "text-soft": "#9CA3AF"
        }
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "20px",
        md: "16px",
        sm: "12px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 14px 28px rgba(15, 23, 42, 0.08)",
        tile: "0 10px 18px rgba(15, 23, 42, 0.06)",
        "btn-primary": "0 10px 20px rgba(36, 108, 108, 0.25)",
        "btn-secondary": "0 6px 15px rgba(15, 23, 42, 0.06)",
        soft: "0 6px 14px rgba(15, 23, 42, 0.04)"
      },
      spacing: {
        page: "32px",
        section: "24px",
        card: "24px"
      },
      backgroundImage: {
        "gradient-cc-primary": "linear-gradient(90deg, #246C6C 0%, #ABCA20 100%)"
      }
    }
  },
  plugins: []
};

export default config;
