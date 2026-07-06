import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // CSS reset disabled: the project ships its own global styles (src/index.css,
  // App.css) and CSS-module components that a reset would visually shift
  preflight: false,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",
});
