import { defineCollection, reference, z } from "astro:content";
import type { GeoJSON } from "geojson";
import { gpxLoader } from "@utils/gpxLoader.ts";
import { JourneyTypeId, StatId } from "@utils/types.ts";
import { nextcloudLoader, parseMarkdown } from "@utils/nextcloudLoader.ts";

const blogCollection = defineCollection({
  loader: nextcloudLoader({
    fileType: "md",
    parser: parseMarkdown,
  }),
  // NOTE: remove the loader defined above if you want to use this local loader
  // loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      // sync with utils/types/journeyTypes
      type: z.nativeEnum(JourneyTypeId),
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
      // statistics. every key here is optional, and you can omit the whole thing
      stats: z
        .object({
          [StatId.topSpeed]: z.number().positive(),
          [StatId.totalTime]: z.number().positive(),
          [StatId.totalDistance]: z.number().positive(),
        })
        .partial()
        .optional(),
    }),
});

const gpxCollection = defineCollection({
  /*loader: nextcloudLoader({
    fileType: "gpx",
    parser: parseGpx,
  }),*/
  // NOTE: remove the loader defined above if you want to use this local loader
  loader: gpxLoader({ url: "./posts" }),
  schema: z.custom<GeoJSON>(),
});

export const collections = {
  posts: blogCollection,
  gpx: gpxCollection,
};
