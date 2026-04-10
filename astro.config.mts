// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import vue from "@astrojs/vue";
import { templateCompilerOptions } from "@tresjs/core";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://l0drex.github.io",
  base: "/travel",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Noto Serif",
      cssVariable: "--font-noto-serif",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/NotoSerif-VariableFont_wdth,wght.ttf"],
            style: "normal",
            weight: "100 900",
            stretch: "62.5% 100%",
            display: "swap",
          },
          {
            src: [
              "./src/assets/fonts/NotoSerif-Italic-VariableFont_wdth,wght.ttf",
            ],
            style: "italic",
            weight: "100 900",
            stretch: "62.5% 100%",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Noto Sans",
      cssVariable: "--font-noto-sans",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/NotoSans-VariableFont_wdth,wght.ttf"],
            style: "normal",
            weight: "100 900",
            stretch: "62.5% 100%",
            display: "swap",
          },
          {
            src: [
              "./src/assets/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf",
            ],
            style: "italic",
            weight: "100 900",
            stretch: "62.5% 100%",
            display: "swap",
          },
        ],
      },
    },
  ],
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
  i18n: {
    locales: ["de-de"],
    defaultLocale: "de-de",
  },
});
