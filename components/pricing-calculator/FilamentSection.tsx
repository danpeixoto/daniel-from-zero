import type { PricingInput } from "@/lib/pricing";
import { formatBRL } from "@/lib/format";
import { Field, inputClassName } from "./Field";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

function parseNum(raw: string): number {
  const v = Number(raw.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

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
          <input
            id="spool-price"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={spoolPrice}
            onChange={(e) =>
              onChange({
                ...value,
                filament: {
                  ...value.filament,
                  spoolPrice: Math.max(0, parseNum(e.target.value)),
                },
              })
            }
            className={inputClassName}
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
          <input
            id="spool-weight"
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={spoolWeight}
            onChange={(e) =>
              onChange({
                ...value,
                filament: {
                  ...value.filament,
                  spoolWeight: Math.max(0, parseNum(e.target.value)),
                },
              })
            }
            className={inputClassName}
          />
        </Field>

        <Field
          id="used-weight"
          label="Filamento usado (g)"
          hint="Peso total de filamento para todo o pedido."
        >
          <input
            id="used-weight"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={usedWeight}
            onChange={(e) =>
              onChange({
                ...value,
                filament: {
                  ...value.filament,
                  usedWeight: Math.max(0, parseNum(e.target.value)),
                },
              })
            }
            className={inputClassName}
          />
        </Field>

        <p className="font-[family-name:var(--font-mono)] text-[0.9375rem] text-[var(--color-accent)]">
          Custo estimado de filamento: {formatBRL(estimatedCost)}
        </p>
      </div>
    </section>
  );
}
