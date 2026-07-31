import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        pubg: {
          dark: "#0a0e17",
          card: "#121826",
          cardHover: "#1a2235",
          border: "#1f293d",
          gold: "#f3af19",
          goldGlow: "rgba(243, 175, 25, 0.3)",
          orange: "#ff5722",
          orangeGlow: "rgba(255, 87, 34, 0.3)",
          silver: "#94a3b8",
          bronze: "#d97706",
          emerald: "#10b981",
          cyan: "#06b6d4"
        }
      },
      boxShadow: {
        'neon-gold': '0 0 20px rgba(243, 175, 25, 0.35)',
        'neon-orange': '0 0 20px rgba(255, 87, 34, 0.35)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'neon-emerald': '0 0 20px rgba(16, 185, 129, 0.35)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, #1e293b 0%, #0a0e17 80%)',
        'gold-gradient': 'linear-gradient(135deg, #fef08a 0%, #f3af19 50%, #b45309 100%)',
        'silver-gradient': 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #475569 100%)',
        'bronze-gradient': 'linear-gradient(135deg, #ffedd5 0%, #d97706 50%, #78350f 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(26, 34, 53, 0.8) 0%, rgba(18, 24, 38, 0.95) 100%)'
      }
    },
  },
  plugins: [],
};
export default config;
