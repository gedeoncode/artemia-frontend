import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx, mdx}",
  ],

  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem", // 10px - very small, labels or meta text
        xs: "0.75rem", // 12px - captions, footnotes
        sm: "0.875rem", // 14px - small body text
        base: "1rem", // 16px - main body text
        lg: "1.125rem", // 18px - slightly larger text, subheaders
        xl: "1.25rem", // 20px - section headings
        "2xl": "1.5rem", // 24px - main headings
        "3xl": "1.875rem", // 30px - large headings or hero text
        "4xl": "2.25rem", // 36px - very large headings
        "5xl": "3rem", // 48px - prominent headings
        "6xl": "3.75rem", // 60px - display text
        "7xl": "4.5rem", // 72px - oversized display
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        popUp: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "pop-up": "popUp 0.2s ease-out",
      },
      backgroundImage: {
        "grid-slate-100/[0.03]":
          "linear-gradient(to right, rgb(241 245 249 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(241 245 249 / 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "32px": "32px 32px",
      },
    },
  },

  plugins: [tailwindcssAnimate, tailwindcssTypography],
};

export default config;
