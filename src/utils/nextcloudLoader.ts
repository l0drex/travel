import type { Loader } from "astro/loaders";
import { createClient, type FileStat } from "webdav";
import type { AstroConfig } from "astro";
import type { RenderedContent } from "astro:content";
import { NC_HOST, NC_TOKEN } from "astro:env/server";
import {
  createMarkdownProcessor,
  parseFrontmatter,
} from "@astrojs/markdown-remark";
import imgLinks from "@pondorasti/remark-img-links";

interface WebDavOptions {
  // parses the file content (string)
  parser: (
    text: string,
    filePath: string,
    config: AstroConfig,
  ) => Promise<{ rendered?: RenderedContent; data: any }>;
  // list of file endings
  fileType: string;
}

const lastModifiedKey = "lastModified";
// only for development
const forceRerender = false;

export const ncPath = `public.php/dav/files/${NC_TOKEN}/`;

export function nextcloudLoader(options: WebDavOptions): Loader {
  return {
    name: "WebDAV Loader",
    load: async (context) => {
      if (!NC_HOST) {
        throw new Error(
          "No host provided. Make sure that all necessary environment variables are set.",
        );
      }

      const client = createClient(NC_HOST);

      // check if data is already stored and update if necessary

      const dirStat = (await client.stat(ncPath).catch((reason) => {
        throw reason;
      })) as FileStat;
      const lastChanged = new Date(dirStat.lastmod);
      const currentChangeStr = context.meta.get(lastModifiedKey);

      if (!forceRerender && currentChangeStr != undefined) {
        const currentChange = new Date(currentChangeStr);
        if (currentChange.valueOf() <= lastChanged.valueOf()) {
          context.logger.info("No changes detected...");
          return;
        }
      }

      context.logger.info(`Directory ${ncPath} was changed, updating...`);
      context.meta.set(lastModifiedKey, lastChanged.toISOString());

      // update content

      const files = await client
        .getDirectoryContents(ncPath, { deep: true })
        .catch((reason) => {
          throw reason;
        })
        .then((files) =>
          (files as FileStat[]).filter(
            (f) => f.type === "file" && f.basename.endsWith(options.fileType),
          ),
        );

      const promises = files.map(async (f) => {
        // filename without extension
        const id = getId(f.basename);

        let text: string | undefined;

        const lastChange = (await client.stat(f.filename).catch((reason) => {
          throw reason;
        })) as FileStat;
        if (lastChange.lastmod === context.store.get(id)?.digest) {
          // file did not change
          if (forceRerender) {
            text = context.store.get(id)?.body;
          } else {
            return;
          }
        }

        context.logger.info(`File ${id} was changed, updating...`);

        text ??= (await client
          .getFileContents(f.filename, { format: "text" })
          .catch((reason) => {
            throw reason;
          })) as string;

        const { rendered, data } = await options
          .parser(text, f.filename, context.config)
          .catch((reason) => {
            throw reason;
          });

        const parsedData = await context
          .parseData({
            id,
            data,
          })
          .catch((reason) => {
            throw reason;
          });
        context.store.set({
          id,
          data: parsedData,
          rendered,
          body: text,
          digest: lastChange.lastmod,
        });
      });

      await Promise.all(promises).catch((reason) => {
        throw reason;
      });
    },
  };
}

function getId(filename: string): string {
  const file = filename.split(".");
  file.pop();
  return file.join(".");
}

export async function parseMarkdown(
  code: string,
  filePath: string,
  opts: AstroConfig,
) {
  const data = parseFrontmatter(code, {
    frontmatter: "empty-with-spaces",
  });

  // do some magic to load images from nextcloud
  const path = filePath.split("/");
  path.pop();
  const directory = path.join("/");
  const absolutePath = `${NC_HOST}${directory}/`;

  if (data.frontmatter.image) {
    data.frontmatter.image = new URL(data.frontmatter.image, absolutePath).href;
  }

  const markdownOptions = opts.markdown;
  markdownOptions.remarkPlugins.push([imgLinks, { absolutePath }]);

  // process the markdown file

  const processor = await createMarkdownProcessor({
    image: opts.image,
    ...markdownOptions,
  });

  const render = await processor.render(data.content, {
    frontmatter: data.frontmatter,
  });

  return {
    data: render.metadata.frontmatter,
    rendered: {
      html: render.code,
      metadata: {
        imagePaths: render.metadata.localImagePaths.concat(
          render.metadata.remoteImagePaths,
        ),
        headings: render.metadata.headings,
        frontmatter: render.metadata.frontmatter,
      },
    },
  };
}
