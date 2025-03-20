import { DOMParser } from "@xmldom/xmldom";
import { gpx as gpxToJson } from "@tmcw/togeojson";
import type { Loader, LoaderContext } from "astro/loaders";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "astro:content";
import path from "node:path";
import type { GeoJSON } from "geojson";

export async function parseGpx(code: string) {
  const xml = new DOMParser().parseFromString(code, "text/xml");
  const geoJson = gpxToJson(xml as any);

  return { data: geoJson };
}

async function loadGpxFiles(directory: string, context: LoaderContext) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((f) => {
      if (!f.isFile()) {
        return;
      }

      const path = f.parentPath + f.name;
      context.logger.info("Found file " + path);

      updateFile(path, context);
    });
  });
}

async function updateFile(filePath: string, context: LoaderContext) {
  // name of file without extension
  const fileName = path.basename(filePath).replace(/\.gpx$/, "");
  // path to file relative to project root
  const relativePath = filePath.replace(fileURLToPath(context.config.root), "");

  fs.readFile(filePath, { encoding: "utf-8" }, async (err, data) => {
    if (err) throw err;

    const parsedData = await context.parseData({
      id: fileName,
      data: await parseGpx(data),
      filePath: relativePath,
    });
    const digest = context.generateDigest(parsedData);

    context.store.set({
      id: fileName,
      data: parsedData,
      digest,
      filePath: relativePath,
    });
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
    schema: async () => {
      return z.custom<GeoJSON>();
    },
  };
}
