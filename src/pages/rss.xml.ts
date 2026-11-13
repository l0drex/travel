import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import authors from "src/authors.json";
import { getImage } from "astro:assets";


const posts: CollectionEntry<"posts">[] = (await getCollection("posts")).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

export const GET: APIRoute = async (context) => {
  const items: RSSFeedItem[] = [];

  for (let p of posts) {
    const previewImage = await getImage({
      src: p.data.image,
      width: 1200,
      height: 630,
      format: "webp",
    });

    items.push({
      title: p.data.title,
      pubDate: p.data.date,
      author: authors.find((author) => author.id === p.data.author)?.name,
      description: p.data.description,
      link: `${import.meta.env.BASE_URL}/journey/${p.id}`,
      categories: [p.data.type],
      enclosure: {
        url: previewImage.src,
        // not correct, but a rough approximation for now
        length: 1200 * 630 * 3,
        type: "webp",
      },
    });
  }

  return rss({
    title: "Lorenz Travel Blog",
    description: "Biking trips all around europe",
    site: `${context.site}/${import.meta.env.BASE_URL}`,
    items,
    customData: "<language>de-de</language>",
  });
};
