import { z, defineCollection, reference } from "astro:content";
import type { GeoJSON } from "geojson";
import { nextcloudLoader, parseMarkdown } from "@utils/nextcloudLoader.ts";
import { parseGpx } from "@utils/gpxLoader.ts";

const blogCollection = defineCollection({
  loader: nextcloudLoader({
    fileType: "md",
    parser: parseMarkdown,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      // sync with utils/types/journeyTypes
      type: z.literal("bike").or(z.literal("hiking")).or(z.literal("roadtrip")),
      // preview image used for open graph previews and the list on the home page
      image: image(),
      alt: z.string(),
      // a gpx track of the tour, will generate a map, elevation profile and entry on the background globe on the home page
      gpx: reference("gpx"),
      // key to the author of the post
      // sync with authors.json
      author: z.literal("lorenz"),
      // short description of the tour
      description: z.string(),
    }),
});

const gpxCollection = defineCollection({
  loader: nextcloudLoader({
    fileType: "gpx",
    parser: parseGpx,
  }),
  schema: z.custom<GeoJSON>(),
});

export const collections = {
  posts: blogCollection,
  gpx: gpxCollection,
};
