import type { Loader, LoaderContext } from "astro/loaders";
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
    context: LoaderContext,
  ) => Promise<{ rendered?: RenderedContent; data: any }>;
  // list of file endings
  fileType: string;
}

const lastModifiedKey = "lastModified";
// only for development
const forceRerender = false;

export const ncPath = `public.php/dav/files/${NC_TOKEN}/`;

const placeholderPath = "./src/content/posts/placeholder.md";

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
          .parser(text, f.filename, context)
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
          // important to resolve images correctly
          filePath: placeholderPath,
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
  context: LoaderContext,
) {
  // do some magic to load images from nextcloud

  // remove markdown file name
  const path = filePath.split("/");
  path.pop();
  const directory = path.join("/");

  const absolutePath = `${NC_HOST}${directory}/`;

  // copy context because this is async
  const c = { ...context };

  // add remark plugin to change relative urls in markdown
  c.config.markdown.remarkPlugins.push([imgLinks, { absolutePath }]);

  // parse frontmatter (custom metadata)
  const data = parseFrontmatter(code, {
    frontmatter: "empty-with-spaces",
  });

  // change preview image url
  if (data.frontmatter.image) {
    data.frontmatter.image = new URL(data.frontmatter.image, absolutePath).href;
  }

  // render markdown content
  const render = await renderMarkdown(data.content, c.config);
  // this does not work, as the config in the context is not used by the md renderer in the same context object
  // await c.renderMarkdown(data.content);

  // add frontmatter data
  render.metadata ??= { imagePaths: [] };
  render.metadata.frontmatter = data.frontmatter;

  return {
    data: render.metadata.frontmatter,
    rendered: render,
  };
}

async function renderMarkdown(
  code: string,
  opts: AstroConfig,
): Promise<RenderedContent> {
  const processor = await createMarkdownProcessor({
    image: opts.image,
    ...opts.markdown,
  });

  const render = await processor.render(code, {
    // @ts-expect-error not exposed in type of astro
    fileURL: placeholderPath,
  });

  const imagePaths = [
    ...render.metadata.localImagePaths,
    ...render.metadata.remoteImagePaths,
  ];

  return {
    html: render.code,
    metadata: {
      imagePaths,
      headings: render.metadata.headings,
    },
  };
}
