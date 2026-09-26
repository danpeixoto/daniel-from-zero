import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Textos sobre a jornada Daniel From Zero — o que foi testado, o que não deu certo e o resultado até agora.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "Textos sobre a jornada — o que foi testado, o que não deu certo e o resultado até agora.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section className="!py-16 sm:!py-20 md:!py-28">
      <h1 className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]">
        Blog
      </h1>
      <p className="mt-3 max-w-xl text-base text-[var(--color-ink-muted)] sm:mt-4 sm:text-lg">
        Textos sobre o que eu testei, o que não deu certo e o resultado até
        agora.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-[0.9375rem] text-[var(--color-ink-muted)] sm:text-base">
          Ainda não tem posts publicados.
        </p>
      ) : (
        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Card href={`/blog/${post.slug}`} tag={post.tags?.[0]}>
                <time
                  dateTime={post.publishedAt}
                  className="font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--color-ink-muted)]"
                >
                  {formatPostDate(post.publishedAt)}
                </time>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold sm:text-xl">
                  {post.headline ?? post.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                  {post.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
