import type { GetStaticPaths, APIRoute } from "astro";
import { getCollection } from "astro:content";

export const getStaticPaths = (async () => {
  const entries = await getCollection("gpx");
  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props: { entry } }) => {
  return new Response(entry.data.raw, {
    headers: { "Content-Type": "application/gpx+xml" },
  });
};
