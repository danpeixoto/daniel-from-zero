import type { PricingInput } from "@/lib/pricing";
import { Field, inputClassName } from "./Field";
import { DecimalInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

export function PackagingSection({ value, onChange }: Props) {
  const packaging = value.packaging ?? { value: 0, type: "unit" as const };

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        Embalagem
      </h2>
      <p className="mt-2 text-[0.8125rem] text-[var(--color-ink-muted)]">
        Caixa, envelope, plástico-bolha, etiqueta — o que for necessário para
        enviar ou entregar a peça.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          id="packaging-type"
          label="Tipo"
          tooltip="Por unidade multiplica pelo número de peças. Valor total é um custo único do pedido."
        >
          <select
            id="packaging-type"
            value={packaging.type}
            onChange={(e) =>
              onChange({
                ...value,
                packaging: {
                  ...packaging,
                  type: e.target.value as "unit" | "total",
                },
              })
            }
            className={inputClassName}
          >
            <option value="unit">Por unidade</option>
            <option value="total">Valor total</option>
          </select>
        </Field>

        <Field
          id="packaging-value"
          label="Custo de embalagem (R$)"
          hint={
            packaging.type === "unit"
              ? "Quanto custa embalar cada peça."
              : "Custo total de embalagem deste pedido."
          }
        >
          <DecimalInput
            id="packaging-value"
            min={0}
            maxFractionDigits={2}
            value={packaging.value}
            onChange={(next) =>
              onChange({
                ...value,
                packaging: { ...packaging, value: next },
              })
            }
          />
        </Field>
      </div>
    </section>
  );
}
