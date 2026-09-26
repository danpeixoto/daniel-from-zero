import type { PricingInput } from "@/lib/pricing";
import { Field } from "./Field";
import { DecimalInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

export function MarginSection({ value, onChange }: Props) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        Margem desejada
      </h2>
      <div className="mt-6 flex flex-col gap-5">
        <Field
          id="desired-margin"
          label="Margem sobre o preço de venda (%)"
          hint="Padrão sugerido: 40%."
          tooltip={
            <>
              Margem é o lucro em relação ao preço de venda — não é markup sobre
              o custo. Exemplo: custo R$ 60, venda R$ 100, lucro R$ 40 → margem
              de 40%. Markup seria 1,67× o custo.
            </>
          }
        >
          <DecimalInput
            id="desired-margin"
            min={0}
            max={99}
            maxFractionDigits={2}
            value={value.desiredMargin}
            onChange={(desiredMargin) => onChange({ ...value, desiredMargin })}
          />
        </Field>
      </div>
    </section>
  );
}
