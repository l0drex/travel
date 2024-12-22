import type { Plugin, TransformResult } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import { DOMParser } from 'xmldom';
import { gpx as gpxToJson } from '@tmcw/togeojson';
import type { AstroIntegration, ContentEntryType, HookParameters } from "astro";
import { fileURLToPath } from 'node:url';

interface PluginOptions {
  include?: string;
  exclude?: string;
}

type SetupHookParams = HookParameters<'astro:config:setup'> & {
  // `contentEntryType` is not a public API
  // Add type defs here
  addContentEntryType: (contentEntryType: ContentEntryType) => void;
};


function parseGpx(code: string) {
  const xml = new DOMParser().parseFromString(code);
  const geoJson = gpxToJson(xml);

  return geoJson;
}


function vite(options: PluginOptions = {}): Plugin {
  const filter = createFilter(options.include || '**/*.gpx', options.exclude);

  return {
    name: 'vite-gpx',
    transform(code: string, id: string): TransformResult {
      if (!filter(id)) return null;

      const geoJson = parseGpx(code);
      const jsonContent = JSON.stringify(geoJson, null, 2);

      return {
        code: `export default ${jsonContent};`,
        map: { mappings: '' },
      };
    },
  };
}

export default function gpx(): AstroIntegration {
  return {
    name: 'gpx',
    hooks: {
      'astro:config:setup': async (params) => {
        const { updateConfig, addContentEntryType } = params as SetupHookParams;

        updateConfig({
          vite: {
            plugins: [ vite() ]
          }
        });
        addContentEntryType({
          extensions: ['.gpx'],
          async getEntryInfo({ fileUrl, contents }: { fileUrl: URL; contents: string }) {
            const parsed = parseGpx(contents);
            const urlSplit = fileURLToPath(fileUrl).split('/');
            const fileName = urlSplit[-1];

            return {
              data: {'data': parsed},
              body: JSON.stringify(parsed),
              slug: fileName,
              rawData: contents,
            };
          }
        })
      }
    }
  }
}
