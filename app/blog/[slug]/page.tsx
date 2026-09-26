import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/blog/MdxContent";
import { PostToc } from "@/components/blog/PostToc";
import { Section } from "@/components/Section";
import {
  formatPostDate,
  getPostBySlug,
  getPostSlugs,
  type BlogPost,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: {
      absolute: `${post.title} | ${siteConfig.name}`,
    },
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [siteConfig.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

function buildJsonLd(post: BlogPost) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteConfig.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.headline ?? post.title,
          item: url,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.headline ?? post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      inLanguage: "pt-BR",
      mainEntityOfPage: url,
      author: {
        "@type": "Person",
        name: siteConfig.author.name,
        url: siteConfig.author.url,
      },
      publisher: {
        "@type": "Person",
        name: siteConfig.author.name,
        url: siteConfig.url,
      },
    },
  ];

  if (post.faq && post.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = buildJsonLd(post);
  const headline = post.headline ?? post.title;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="!py-16 sm:!py-20 md:!py-28">
        <article>
          <header className="max-w-2xl">
            <p className="font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-ink-muted)]">
              <Link
                href="/blog"
                className="transition-colors hover:text-[var(--color-accent)]"
              >
                Blog
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt)}
              </time>
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]">
              {headline}
            </h1>
            <p className="mt-4 text-base text-[var(--color-ink-muted)] sm:text-lg">
              {post.description}
            </p>
          </header>

          <PostToc headings={post.headings} />

          <div className="prose-post mt-2">
            <MdxContent source={post.content} />
          </div>
        </article>
      </Section>
    </>
  );
}
