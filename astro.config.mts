// @ts-check
import { defineConfig, envField } from "astro/config";
import vue from "@astrojs/vue";
import { templateCompilerOptions } from "@tresjs/core";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://l0drex.github.io",
  base: "/travel",
  env: {
    schema: {
      NC_HOST: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      NC_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  integrations: [
    vue({
      ...templateCompilerOptions,
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ["hoffmanns.cloud"],
  },
});
