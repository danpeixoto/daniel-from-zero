import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Textos sobre a jornada Daniel From Zero — o que foi testado, o que não deu certo e o resultado até agora. Em breve.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description:
      "Textos sobre a jornada — o que foi testado, o que não deu certo e o resultado até agora. Em breve.",
    url: "/blog",
  },
};

export default function BlogPage() {
  return (
    <Section className="!py-16 sm:!py-20 md:!py-28">
      <h1 className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]">
        Blog
      </h1>
      <p className="mt-3 max-w-xl text-base text-[var(--color-ink-muted)] sm:mt-4 sm:text-lg">
        Ainda não tem posts. Em breve, textos em Markdown sobre o que eu testei
        e o que aprendi no caminho.
      </p>
      <div className="mt-6 sm:mt-8">
        <div className="btn-row">
          <Button href={siteConfig.links.youtube} variant="secondary">
            Assistir no YouTube
          </Button>
        </div>
      </div>
    </Section>
  );
}
