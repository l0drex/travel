// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import { templateCompilerOptions } from "@tresjs/core";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://l0drex.github.io",
  base: "/travel",
  integrations: [vue({
      ...templateCompilerOptions
  }), icon()],
  vite: {
    plugins: [tailwindcss()]
  }
});