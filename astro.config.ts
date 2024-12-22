// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import { templateCompilerOptions } from "@tresjs/core";
import gpx from "./src/astro-gpx/index.ts";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({  
    site: "https://l0drex.github.io/",
    integrations: [vue({
        ...templateCompilerOptions
    }), gpx(), icon()]});
