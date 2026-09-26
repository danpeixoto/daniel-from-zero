import type { Metadata } from "next";
import { PricingCalculator } from "@/components/pricing-calculator";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: {
    absolute:
      "Calculadora de Preço de Impressão 3D | Quanto cobrar por uma impressão 3D",
  },
  description:
    "Calcule quanto cobrar pelas suas impressões 3D considerando filamento, energia, tempo da impressora, mão de obra, impostos, perdas e margem de lucro.",
  alternates: { canonical: "/ferramentas/calculadora-impressao-3d" },
  openGraph: {
    title:
      "Calculadora de Preço de Impressão 3D | Quanto cobrar por uma impressão 3D",
    description:
      "Calcule quanto cobrar pelas suas impressões 3D considerando filamento, energia, tempo da impressora, mão de obra, impostos, perdas e margem de lucro.",
    url: "/ferramentas/calculadora-impressao-3d",
  },
};

export default function CalculadoraImpressao3dPage() {
  return (
    <>
      <Section className="!py-16 sm:!py-20 md:!py-28">
        <h1 className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]">
          Calculadora de Preço para Impressão 3D
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--color-ink-muted)] sm:mt-4 sm:text-lg">
          Descubra quanto realmente custa produzir suas peças e calcule um
          preço de venda sustentável considerando material, máquina, mão de
          obra, perdas, impostos e lucro.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-ink-muted)] sm:mt-4">
          Você não precisa preencher todos os campos. Use apenas o que fizer
          sentido para sua produção.
        </p>

        <div className="mt-8 sm:mt-10">
          <PricingCalculator />
        </div>
      </Section>

      <Section className="border-t border-[var(--color-border)]">
        <div className="prose-narrow space-y-10 text-[0.9375rem] text-[var(--color-ink-muted)] sm:space-y-12 sm:text-base">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[var(--color-ink)]">
              Como calcular o preço de uma impressão 3D?
            </h2>
            <p className="mt-3 sm:mt-4">
              Some o que você gasta de verdade para entregar o pedido:
              filamento, energia, tempo da impressora, mão de obra e custos
              extras. Depois acrescente perdas (falhas, suporte, sobras) e as
              taxas que vão sair no caminho. O preço de venda precisa cobrir
              esse total e ainda sobrar margem — não é só o valor do rolo
              dividido pelo peso da peça.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[var(--color-ink)]">
              Filamento não é o único custo
            </h2>
            <p className="mt-3 sm:mt-4">
              Material é o item mais óbvio, e muitas vezes o menor. A máquina
              ocupa horas, a luz conta, e o seu tempo de preparação, remoção de
              suporte e acabamento também. Ignorar isso deixa o preço
              artificialmente baixo — e a conta só fecha no papel.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[var(--color-ink)]">
              Qual margem usar em impressão 3D?
            </h2>
            <p className="mt-3 sm:mt-4">
              Não existe margem única que sirva para todo mundo. Depende do
              tipo de peça, da concorrência local, do volume e do risco de
              retrabalho. Use a calculadora para testar cenários: veja o que
              sobra depois das taxas e ajuste até o número fazer sentido para
              o seu processo — não para uma regra genérica da internet.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
