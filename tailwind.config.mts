import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// background colors
				bg: {
					DEFAULT: colors.orange["100"],
					dark: colors.stone["950"],
					// 2nd lvl: citations, globe
					2: {
						DEFAULT: colors.orange["200"],
						dark: colors.stone["900"],
					},
					// 3rd lvl: hover state of journey list
					3: {
						DEFAULT: colors.orange["50"],
						dark: colors.stone["700"],
					}
				},
				// foreground (text)
				fg: {
					DEFAULT: colors.orange["900"],
					dark: colors.orange["200"],
					// eg visited links
					inactive: {
						DEFAULT: colors.stone["500"],
						dark: colors.stone["300"],
					}
				},
				// primary accent: active buttons, header on home page, lines in map
				primary: colors.red["600"],
				// secondary accent: lines in graph
				secondary: colors.orange["600"]
			}
		},
	},
	plugins: [],
}
