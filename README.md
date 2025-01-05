# Travel Blog

This is the Astro project of my little travel blog.

You can easily use this for yourself. Just replace the markdown files in `src/content/posts` - that's it!
If you want, you can add and link a GPX file of your travel journey in the `gpx` folder.
The metadata is documented in the [collection config](src/content/config.ts).

Finally, run the dev command below to preview the website in the browser, or another command to deploy it.
You can also deploy the site on GitHub pages.

You can adjust the colors in the [tailwind config](tailwind.config.mts). As the project uses tailwind, I recommend using one of the
colors in [their palette](https://tailwindcss.com/docs/customizing-colors).

The map style can be adjusted in `src/components/track/MapView.vue`. There are some predefined styles,
but of course you can add your own. Be aware that you need to have a (free) account for some of them once deployed.

## 🚀 Project Structure

Inside this project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
|:---------------------------| :----------------------------------------------- |
| `yarn install`             | Installs dependencies                            |
| `yarn run dev`             | Starts local dev server at `localhost:4321`      |
| `yarn run build`           | Build your production site to `./dist/`          |
| `yarn run preview`         | Preview your build locally, before deploying     |
| `yarn run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Checkout [the Astro documentation](https://docs.astro.build).
