import { DOMParser } from "@xmldom/xmldom";
import { gpx as gpxToJson } from "@tmcw/togeojson";
import type { Loader, LoaderContext } from "astro/loaders";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "astro/zod";
import path from "node:path";
import type { GeoJSON } from "geojson";

export async function parseGpx(code: string) {
  const xml = new DOMParser().parseFromString(code, "text/xml");
  const geoJson = gpxToJson(xml);

  return { data: { geoJson, raw: code } };
}

async function loadGpxFiles(directory: string, context: LoaderContext) {
  const files = await fs.promises.readdir(directory, { withFileTypes: true });
  await Promise.all(
    files.map(async (f) => {
      if (!f.isFile()) {
        if (f.isDirectory())
          await loadGpxFiles(path.join(directory, f.name), context);
        return;
      }
      if (!f.name.endsWith(".gpx")) return;
      const p = path.join(f.parentPath, f.name);
      context.logger.info("Found file " + p);
      await updateFile(p, context);
    }),
  );
}

async function updateFile(filePath: string, context: LoaderContext) {
  // name of file without extension
  const fileName = path.basename(filePath).replace(/\.gpx$/, ""); // path to file relative to project root
  const relativePath = filePath.replace(fileURLToPath(context.config.root), "");

  const fileContent = await fs.promises.readFile(filePath, {
    encoding: "utf-8",
  });

  const data = await context.parseData({
    id: fileName,
    data: (await parseGpx(fileContent)).data,
    filePath: relativePath,
  });
  const digest = context.generateDigest(data);

  context.store.set({
    id: fileName,
    data,
    digest,
    filePath: relativePath,
  });
}

// Define any options that the loader needs
export function gpxLoader(options: { url: string }): Loader {
  // Configure the loader

  // Return a loader object
  return {
    name: "GPX Loader",

    // Called when updating the collection.
    load: async (context: LoaderContext): Promise<void> => {
      const url = new URL(options.url, context.config.root + "src/content/");
      const filePath = fileURLToPath(url);

      // Load data and update the store
      await loadGpxFiles(filePath, context);

      context.watcher?.on("change", async (changedPath) => {
        if (!changedPath.startsWith(filePath)) {
          return;
        }

        context.logger.info("Updating file " + changedPath);
        await updateFile(changedPath, context);
      });
    },

    // Optionally, define the schema of an entry.
    // It will be overridden by user-defined schema.
    schema: z.object({ geoJson: z.custom<GeoJSON>(), raw: z.string }),
  };
}
