import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    // sync with utils/travel/journeyTypes
    type: z.literal('bike').or(z.literal('hiking')),
    image: z.optional(z.string()),
    gpx: z.string(), //reference('gpx')
  })
})

const gpxCollection = defineCollection({
  type: 'content',
  schema: z.any()
})

export const collections = {
  'posts' : blogCollection,
  'gpx': gpxCollection
}
