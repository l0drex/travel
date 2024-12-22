import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.string(),
    gpx: z.string(), //reference('gpx')
  })
})

const gpxCollection = defineCollection({
  type: 'content',
  schema: z.any()
})

export const collections = {
  'travel' : blogCollection,
  'gpx': gpxCollection
}
