import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ferramentas",
  description:
    "Ferramentas gratuitas do hub Daniel From Zero. Em breve: calculadora de preço de impressão 3D.",
  alternates: {
    canonical: "/ferramentas",
  },
  openGraph: {
    title: `Ferramentas | ${siteConfig.name}`,
    description:
      "Ferramentas gratuitas do hub. Em breve: calculadora de preço de impressão 3D.",
    url: "/ferramentas",
  },
};

export default function FerramentasPage() {
  return (
    <Section className="!py-16 sm:!py-20 md:!py-28">
      <h1 className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]">
        Ferramentas
      </h1>
      <p className="mt-3 max-w-xl text-base text-[var(--color-ink-muted)] sm:mt-4 sm:text-lg">
        Utilitários que eu uso no meu processo — e que ficam disponíveis para
        quem acompanha o canal. A lista ainda está vazia.
      </p>

      <div className="mt-8 w-full max-w-md sm:mt-10">
        <Card tag="próxima">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold sm:text-xl">
            Calculadora de preço de impressão 3D
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Ainda não está pronta. Quando sair, o link aparece aqui.
          </p>
        </Card>
      </div>

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
