import type { PricingInput } from "@/lib/pricing";
import { Field } from "./Field";
import { IntegerInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

export function ProductionSection({ value, onChange }: Props) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        Produção
      </h2>
      <div className="mt-6 flex flex-col gap-5">
        <Field
          id="quantity"
          label="Quantidade"
          tooltip="Quantas unidades serão produzidas neste pedido."
        >
          <IntegerInput
            id="quantity"
            min={1}
            value={value.quantity}
            onChange={(quantity) => onChange({ ...value, quantity })}
          />
        </Field>

        <div>
          <p className="mb-1.5 text-[0.875rem] font-medium text-[var(--color-ink)]">
            Tempo de impressão
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field id="print-hours" label="Horas">
              <IntegerInput
                id="print-hours"
                min={0}
                value={value.printing.hours}
                onChange={(hours) =>
                  onChange({
                    ...value,
                    printing: { ...value.printing, hours },
                  })
                }
              />
            </Field>
            <Field id="print-minutes" label="Minutos">
              <IntegerInput
                id="print-minutes"
                min={0}
                max={59}
                value={value.printing.minutes}
                onChange={(minutes) =>
                  onChange({
                    ...value,
                    printing: { ...value.printing, minutes },
                  })
                }
              />
            </Field>
          </div>
          <p className="mt-1.5 text-[0.8125rem] text-[var(--color-ink-muted)]">
            Use o tempo estimado pelo seu slicer para produzir todo o pedido.
          </p>
        </div>
      </div>
    </section>
  );
}
