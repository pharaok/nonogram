/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "rgb(var(--color-background) / <alpha-value>)",
          alt: "rgb(var(--color-background-alt) / <alpha-value>)",
        },
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-silkscreen)", "cursive"],
      },
    },
  },
  plugins: [],
};
