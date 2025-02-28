import rss from "@astrojs/rss";
import type {CollectionEntry} from "astro:content";
import {getCollection} from "astro:content";
import type {APIRoute} from "astro";

const posts: CollectionEntry<"posts">[] = (await getCollection("posts"))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());


export const GET: APIRoute = (context) => {
    return rss({
        title: 'Lorenz Travel Blog',
        description: 'Biking trips all around europe',
        site: `${context.site}/${import.meta.env.BASE_URL}`,
        items: posts.map(p => ({
            title: p.data.title,
            pubDate: p.data.date,
            description: p.data.description,
            link: `${import.meta.env.BASE_URL}/${p.id}`,
            categories: [p.data.type]
        })),
        customData: '<language>de-de</language>'
    })
};
