/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        accent: "#e50914",
        "accent-dark": "#b00710",
        surface: {
          0: "#000000",
          1: "#0a0a0a",
          2: "#111111",
          3: "#1a1a1a",
          4: "#222222",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        card: "16px",
        xl2: "24px",
      },
      backdropBlur: {
        xs: "4px",
        "2xl": "40px",
        "3xl": "80px",
      },
      animation: {
        fadeUp: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        fadeIn: "fadeIn 0.7s ease forwards",
        fadeOut: "fadeOut 0.3s ease forwards",
        scaleIn: "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        titlePop: "titlePop 0.7s ease forwards",
      },

      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        scaleIn: {
          from: { opacity: 0, transform: "scale(0.94)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(229,9,20,0.35)" },
          "50%": { boxShadow: "0 0 60px rgba(229,9,20,0.5)" },
        },
        titlePop: {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      boxShadow: {
        "glow-red": "0 0 40px rgba(229,9,20,0.35)",
        "glow-red-lg": "0 0 80px rgba(229,9,20,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.7)",
      },
    },
  },
  plugins: [],
};
