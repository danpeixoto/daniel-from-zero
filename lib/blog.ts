import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  draft?: boolean;
  /** Heading shown as H1; falls back to title */
  headline?: string;
  faq?: BlogFaqItem[];
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  headings: BlogHeading[];
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    return [] as string[];
  }
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const seen = new Map<string, number>();

  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\s+#+\s*$/, "").trim();
    if (!text) continue;

    let id = slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ id, text, level });
  }

  return headings;
}

function parsePostFile(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as BlogFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    tags: frontmatter.tags ?? [],
    draft: Boolean(frontmatter.draft),
    headline: frontmatter.headline,
    faq: frontmatter.faq,
    content,
    headings: extractHeadings(content),
  };
}

function isVisible(post: BlogPostMeta): boolean {
  if (!post.draft) return true;
  return !isProduction();
}

export function getAllPosts(): BlogPostMeta[] {
  return ensureBlogDir()
    .map((file) => {
      const post = parsePostFile(file);
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        tags: post.tags,
        draft: post.draft,
        headline: post.headline,
        faq: post.faq,
      };
    })
    .filter(isVisible)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filename = `${slug}.mdx`;
  const filepath = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(filepath)) return null;

  const post = parsePostFile(filename);
  if (!isVisible(post)) return null;
  return post;
}

export function formatPostDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
