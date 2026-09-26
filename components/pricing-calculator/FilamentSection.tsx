import type { PricingInput } from "@/lib/pricing";
import { formatBRL } from "@/lib/format";
import { Field } from "./Field";
import { DecimalInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

export function FilamentSection({ value, onChange }: Props) {
  const { spoolPrice, spoolWeight, usedWeight } = value.filament;
  const estimatedCost =
    spoolWeight > 0 ? (spoolPrice / spoolWeight) * usedWeight : 0;

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        Filamento
      </h2>
      <div className="mt-6 flex flex-col gap-5">
        <Field id="spool-price" label="Preço do rolo (R$)">
          <DecimalInput
            id="spool-price"
            min={0}
            maxFractionDigits={2}
            value={spoolPrice}
            onChange={(next) =>
              onChange({
                ...value,
                filament: { ...value.filament, spoolPrice: next },
              })
            }
          />
        </Field>

        <Field
          id="spool-weight"
          label="Peso do rolo (g)"
          hint="A maioria dos rolos vem com 1000 g."
          error={
            spoolWeight <= 0
              ? "Informe o peso do rolo maior que zero."
              : undefined
          }
        >
          <DecimalInput
            id="spool-weight"
            min={0}
            maxFractionDigits={1}
            value={spoolWeight}
            onChange={(next) =>
              onChange({
                ...value,
                filament: { ...value.filament, spoolWeight: next },
              })
            }
            aria-invalid={spoolWeight <= 0}
          />
        </Field>

        <Field
          id="used-weight"
          label="Filamento usado (g)"
          hint="Peso total de filamento para todo o pedido."
        >
          <DecimalInput
            id="used-weight"
            min={0}
            maxFractionDigits={1}
            value={usedWeight}
            onChange={(next) =>
              onChange({
                ...value,
                filament: { ...value.filament, usedWeight: next },
              })
            }
          />
        </Field>

        <p className="font-[family-name:var(--font-mono)] text-[0.9375rem] text-[var(--color-accent)]">
          Custo estimado de filamento: {formatBRL(estimatedCost)}
        </p>
      </div>
    </section>
  );
}
