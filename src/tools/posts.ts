// src/tools/posts.ts
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ghostApiClient } from "../ghostApi";

// Parameter schemas as ZodRawShape (object literals)
const browseParams = {
  filter: z.string().optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
  order: z.string().optional(),
};

const readParams = {
  id: z.string().optional(),
  slug: z.string().optional(),
};

// Shared sub-schemas for relationships
const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
});

const authorSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  email: z.string().optional(),
});

const tierSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
});

const addParams = {
  title: z.string(),
  slug: z.string().optional(),
  html: z.string().optional(),
  lexical: z.string().optional(),
  status: z.string().optional(),
  // Visibility & access
  visibility: z.string().optional().describe("Post visibility: public, members, paid, tiers"),
  tiers: z.array(tierSchema).optional().describe("Array of tier objects for tier-based visibility"),
  // Featured image
  feature_image: z.string().optional().describe("URL for the featured/hero image"),
  feature_image_alt: z.string().optional().describe("Alt text for the featured image"),
  feature_image_caption: z.string().optional().describe("Caption for the featured image"),
  // Excerpt
  custom_excerpt: z.string().optional().describe("Custom excerpt for the post"),
  // SEO metadata
  meta_title: z.string().optional().describe("Custom meta title for SEO"),
  meta_description: z.string().optional().describe("Custom meta description for SEO"),
  canonical_url: z.string().optional().describe("Canonical URL for SEO"),
  // Open Graph
  og_title: z.string().optional().describe("Open Graph title for social sharing"),
  og_description: z.string().optional().describe("Open Graph description for social sharing"),
  og_image: z.string().optional().describe("Open Graph image URL for social sharing"),
  // Twitter Card
  twitter_title: z.string().optional().describe("Twitter card title"),
  twitter_description: z.string().optional().describe("Twitter card description"),
  twitter_image: z.string().optional().describe("Twitter card image URL"),
  // Code injection
  codeinjection_head: z.string().optional().describe("Custom code injected into <head>"),
  codeinjection_foot: z.string().optional().describe("Custom code injected before </body>"),
  // Relationships
  tags: z.array(tagSchema).optional().describe("Array of tag objects (id or name)"),
  authors: z.array(authorSchema).optional().describe("Array of author objects (id, slug, or email)"),
  // Publishing
  published_at: z.string().optional().describe("Publication date in ISO 8601 format"),
  custom_template: z.string().optional().describe("Custom Handlebars template for this post"),
  // Email
  email_only: z.boolean().optional().describe("If true, post is only sent via email"),
  // Featured
  featured: z.boolean().optional().describe("Whether the post is featured"),
};

const editParams = {
  id: z.string(),
  updated_at: z.string(),
  title: z.string().optional(),
  slug: z.string().optional(),
  html: z.string().optional(),
  lexical: z.string().optional(),
  status: z.string().optional(),
  // Visibility & access
  visibility: z.string().optional().describe("Post visibility: public, members, paid, tiers"),
  tiers: z.array(tierSchema).optional().describe("Array of tier objects for tier-based visibility"),
  // Featured image
  feature_image: z.string().optional().describe("URL for the featured/hero image"),
  feature_image_alt: z.string().optional().describe("Alt text for the featured image"),
  feature_image_caption: z.string().optional().describe("Caption for the featured image"),
  // Excerpt
  custom_excerpt: z.string().optional().describe("Custom excerpt for the post"),
  // SEO metadata
  meta_title: z.string().optional().describe("Custom meta title for SEO"),
  meta_description: z.string().optional().describe("Custom meta description for SEO"),
  canonical_url: z.string().optional().describe("Canonical URL for SEO"),
  // Open Graph
  og_title: z.string().optional().describe("Open Graph title for social sharing"),
  og_description: z.string().optional().describe("Open Graph description for social sharing"),
  og_image: z.string().optional().describe("Open Graph image URL for social sharing"),
  // Twitter Card
  twitter_title: z.string().optional().describe("Twitter card title"),
  twitter_description: z.string().optional().describe("Twitter card description"),
  twitter_image: z.string().optional().describe("Twitter card image URL"),
  // Code injection
  codeinjection_head: z.string().optional().describe("Custom code injected into <head>"),
  codeinjection_foot: z.string().optional().describe("Custom code injected before </body>"),
  // Relationships
  tags: z.array(tagSchema).optional().describe("Array of tag objects (id or name)"),
  authors: z.array(authorSchema).optional().describe("Array of author objects (id, slug, or email)"),
  // Publishing
  published_at: z.string().optional().describe("Publication date in ISO 8601 format"),
  custom_template: z.string().optional().describe("Custom Handlebars template for this post"),
  // Email
  email_only: z.boolean().optional().describe("If true, post is only sent via email"),
  // Featured
  featured: z.boolean().optional().describe("Whether the post is featured"),
};

const deleteParams = {
  id: z.string(),
};

export function registerPostTools(server: McpServer) {
  // Browse posts
  server.tool(
    "posts_browse",
    browseParams,
    async (args, _extra) => {
      const posts = await ghostApiClient.posts.browse(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(posts, null, 2),
          },
        ],
      };
    }
  );

  // Read post
  server.tool(
    "posts_read",
    readParams,
    async (args, _extra) => {
      const post = await ghostApiClient.posts.read(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(post, null, 2),
          },
        ],
      };
    }
  );

  // Add post
  server.tool(
    "posts_add",
    addParams,
    async (args, _extra) => {
      // If html is present, use source: "html" to ensure Ghost uses the html content
      const options = args.html ? { source: "html" } : undefined;
      const post = await ghostApiClient.posts.add(args, options);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(post, null, 2),
          },
        ],
      };
    }
  );

  // Edit post
  server.tool(
    "posts_edit",
    editParams,
    async (args, _extra) => {
      // If html is present, use source: "html" to ensure Ghost uses the html content for update
      const options = args.html ? { source: "html" } : undefined;
      const post = await ghostApiClient.posts.edit(args, options);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(post, null, 2),
          },
        ],
      };
    }
  );

  // Delete post
  server.tool(
    "posts_delete",
    deleteParams,
    async (args, _extra) => {
      await ghostApiClient.posts.delete(args);
      return {
        content: [
          {
            type: "text",
            text: `Post with id ${args.id} deleted.`,
          },
        ],
      };
    }
  );
}
