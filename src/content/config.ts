import {z, defineCollection, reference} from "astro:content";
import {gpxLoader} from "@utils/gpxLoader.ts";

const blogCollection = defineCollection({
  type: 'content',
  schema: ({image}) => z.object({
    title: z.string(),
    date: z.date(),
    // sync with utils/types/journeyTypes
    type: z.literal('bike').or(z.literal('hiking')),
    // preview image used for open graph previews and the list on the home page
    image: image(),
    // a gpx track of the tour, will generate a map, elevation profile and entry on the background globe on the home page
    gpx: reference('gpx'),
    // key to the author of the post
    // sync with authors.json
    author: z.literal("lorenz"),
    // short description of the tour
    description: z.string(),
  })
})

// .gpx files of your journeys
const gpxCollection = defineCollection({
  loader: gpxLoader({url: "./gpx/"}),
  schema: z.any()
})

export const collections = {
  'posts' : blogCollection,
  'gpx': gpxCollection
}
