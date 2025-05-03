# Travel Blog

This is the Astro project of my little travel blog. If you want to use this for yourself, here is a quick setup guide.

## 📄 Adding your content

Content rendered on the page is created in two files:

- Markdown files for text and images
- GPX files for geographic data. This is what is rendered in map and elevation graph, and the data is used to place a dot on the globe in the home page.

Authors are defined in `src/authors.json`. Each author has a key for reference in markdown files, a name and a fediverse id.
The latter is referenced to link your Fediverse profile when sharing posts on Mastodon.

```json
[
  {
    "id": "key-referenced-from-markdown",
    "name": "Joe Doe",
    "fediverse": "@user@example.com"
  }
]
```

There are two options readily available in this repo:

### Local files

For the first option, go to `src/content/config.ts` and
change the loaders to the local loader defined below by uncommenting it and commenting the other one above out.
Then place a markdown file in `src/content/posts` with the following data:

```md
---
title: Awesome adventure
date: 2024-06-28
type: bike
author: id-from-author.json
gpx: gpx-file-name-without-path-or-extension
image: "./path-to-preview-image.jpg"
alt: Alt text for the preview image.
description: Short description of your awesome adventure.
---

# Your content starts here

Every heading (no matter what depth) is a day.
The data above is explained in the type definition in `src/content/config.ts`.
```

Now create a gpx file for your posts. Each post references a gpx file through the `gpx` key in the frontmatter.
If you have a gpx file `src/content/gpx/adventure.gpx`, then the value in the markdown file would be:

```
...
gpx: adventure
...
```

You can create GPX files using [gpx.studio](https://gpx.studio) if you don't have any.
If you give the groups the same name as the headings in your markdown, the map will highlight the corresponding track
if you put it in the url.

For example, take this GPX file (structure corresponds to file tree in gpx.studio):

```
journey
    |- First day
    |    |- Segment 1
    |- Last day
```

With markdown like this:

```md
...

# First day

...

# Last day

....
```

Will highlight the corresponding section in the map with the url `.../travel/journey#Start`.

### Files on Nextcloud

You can also host your markdown files, images and gpx files on Nextcloud.
In Nextcloud, create a directory containing all the content files and share it publicly.
The collection config is already set up for this, but you have to specify the access credentials.
Set the following environment variables:

```bash
NC_HOST=https://example.com
NC_TOKEN=secretToken
```

Also set the host in `astro.config.mts` in image domains for image optimizations.

You can get the token from the share url in Nextcloud, e.g. `https://example.com/s/secretToken`.

Images can be referenced locally to the document. Otherwise, file structure doesn't matter, since the files are fetched by type.
Personally, I use the following structure:

```
root
|- /journey
   |- post.md
   |- post.gpx
   |- image.jpg
```

`post.md` would reference the image with `![alt](./image.jpg)`. This means that I also see the image in the preview on Nextcloud.

Images are fetched and optimized at build time, so there is no increased load on you server and the token should be kept private.

Read more in the [Astro documentation](https://docs.astro.build/en/guides/content-collections/).

## 🎨 Customizing the style

Colors are defined in `tailwind.config.mts`. I recommend using the [tailwind color palette](https://tailwindcss.com/docs/colors),
but you can set any value here you want.
Unfortunately, the custom map icons cannot use css, therefore you have to manually edit `src/assets/marker.svg` in order to use a different color.

The map style can be adjusted in `src/components/track/MapView.vue`. There are some predefined styles,
but of course you can add your own. Be aware that you need to have a (free) account for some of them once deployed.

The interactivity of the globe can be disabled by setting the `interactive` const in `src/components/earth/EarthContent.vue`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                      |
| :------------------------- | :------------------------------------------ |
| `yarn install`             | Installs dependencies                       |
| `yarn run dev`             | Starts local dev server at `localhost:4321` |
| `yarn run astro -- --help` | Get help using the Astro CLI                |

I recommend reading into [Astro](https://astro.build/), [Vue](https://vuejs.org/), and [Tailwind](https://tailwindcss.com/) if you want to dig deeper.
