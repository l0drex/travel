import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

// this is still here for reliable access to variables outside of css

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // background colors
        bg: {
          DEFAULT: colors.orange["50"],
          dark: colors.stone["950"],
          // 2nd lvl: citations, globe
          2: {
            DEFAULT: colors.orange["100"],
            dark: colors.stone["900"],
          },
        },
        // foreground (text)
        fg: {
          DEFAULT: colors.stone["800"],
          dark: colors.stone["200"],
          // eg visited links
          inactive: {
            DEFAULT: colors.stone["500"],
            dark: colors.stone["500"],
          },
        },
        // primary accent: active buttons, header on home page, lines in map
        primary: colors.red["600"],
        // secondary accent: lines in graph
        secondary: colors.yellow["600"],
        // grid lines and borders
        line: {
          DEFAULT: colors.stone["600"],
          dark: colors.stone["300"],
        },
      },
      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Noto Serif", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};
