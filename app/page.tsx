import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { SpiralMotif } from "@/components/SpiralMotif";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — jornada, ferramentas e blog`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} — jornada, ferramentas e blog`,
    description: siteConfig.description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-28">
        <SpiralMotif className="pointer-events-none absolute -right-28 -top-20 h-[280px] w-[280px] opacity-60 sm:-right-20 sm:-top-12 sm:h-[380px] sm:w-[380px] sm:opacity-80 md:right-0 md:top-0 md:h-[520px] md:w-[520px] md:opacity-100" />
        <div className="container relative">
          <div className="hero-enter flex max-w-2xl flex-col items-start gap-6 sm:gap-8">
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} — logo em traço circular`}
              width={120}
              height={120}
              className="size-20 rounded-full sm:size-28 md:size-[120px]"
              priority
            />
            <div className="w-full max-w-xl">
              <h1 className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]">
                {siteConfig.name}
              </h1>
              <p className="hero-enter-delay mt-3 text-base text-[var(--color-ink-muted)] sm:mt-4 sm:text-lg">
                Documentando a saída do zero — acertos, erros e o que for
                aprendendo no caminho.
              </p>
            </div>
            <div className="hero-enter-delay btn-row">
              <Button href={siteConfig.links.youtube}>
                Assistir no YouTube
              </Button>
              <Button href="/ferramentas" variant="secondary">
                Ver ferramentas
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section id="projeto" className="border-t border-[var(--color-border)]">
        <h2 className="font-[family-name:var(--font-display)]">O projeto</h2>
        <div className="prose-narrow mt-4 space-y-4 text-[0.9375rem] text-[var(--color-ink-muted)] sm:mt-6 sm:text-base">
          <p>
            Sou programador de profissão e empreendedor em construção. Criei o
            canal{" "}
            <a
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline underline-offset-4"
            >
              Daniel From Zero
            </a>{" "}
            para documentar a jornada tentando sair do zero e construir negócios
            de verdade — desde encontrar uma ideia, validar um mercado e
            conseguir as primeiras vendas até, quem sabe, construir empresas
            realmente grandes.
          </p>
          <p>
            Aqui você acompanha os acertos, os erros, o dinheiro perdido, o
            dinheiro ganho e tudo que eu aprender no caminho.
          </p>
          <p>
            Não estou aqui para ensinar como alguém que já chegou lá. Estou
            aqui para mostrar o caminho enquanto percorro.
          </p>
        </div>
      </Section>

      <Section id="hub" className="border-t border-[var(--color-border)]">
        <h2 className="font-[family-name:var(--font-display)]">No hub</h2>
        <p className="mt-3 max-w-xl text-[0.9375rem] text-[var(--color-ink-muted)] sm:text-base">
          O site concentra o que estou construindo junto com o canal: conteúdo,
          ferramentas e o registro público da jornada.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <Card href={siteConfig.links.youtube} tag="ao vivo">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold sm:text-xl">
              YouTube
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Episódios e atualizações da jornada. Abre o canal em uma nova aba.
            </p>
          </Card>
          <Card href="/blog" tag="no ar">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold sm:text-xl">
              Blog
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Textos sobre o que testei, o que não deu certo e o resultado até
              agora — incluindo como precificar impressão 3D.
            </p>
          </Card>
          <Card
            href="/ferramentas"
            tag="no ar"
            className="sm:col-span-2 lg:col-span-1"
          >
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold sm:text-xl">
              Ferramentas
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Utilitários gratuitos para mim e para quem acompanha. A primeira
              ferramenta — calculadora de preço de impressão 3D — já está no ar.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="relative overflow-hidden border-t border-[var(--color-border)]">
        <SpiralMotif className="pointer-events-none absolute -left-40 bottom-0 hidden h-[280px] w-[280px] opacity-50 sm:block md:-left-32 md:h-[360px] md:w-[360px] md:opacity-80" />
        <div className="relative max-w-xl">
          <h2 className="font-[family-name:var(--font-display)]">
            Acompanhe enquanto eu percorro o caminho.
          </h2>
          <p className="mt-3 text-[0.9375rem] text-[var(--color-ink-muted)] sm:mt-4 sm:text-base">
            Novos vídeos no canal. Sem fórmula pronta — só o processo real.
          </p>
          <div className="mt-6 sm:mt-8">
            <div className="btn-row">
              <Button href={siteConfig.links.youtube}>
                Assistir no YouTube
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
