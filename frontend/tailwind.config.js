export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arcade: {
          black: "#080808",
          pink: "#ff2fd3",
          green: "#00ff88",
          cyan: "#00e5ff",
          purple: "#8b5cf6",
          yellow: "#ffd700"
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        terminal: ['"VT323"', "monospace"]
      },
      boxShadow: {
        pixel: "0 0 0 2px #080808, 0 0 0 4px #00e5ff, 0 0 28px rgba(0,229,255,.35)",
        pink: "0 0 22px rgba(255,47,211,.45)",
        green: "0 0 22px rgba(0,255,136,.45)"
      },
      animation: {
        scanline: "scanline 7s linear infinite",
        twinkle: "twinkle 2.4s ease-in-out infinite"
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        twinkle: {
          "0%, 100%": { opacity: ".35" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};
