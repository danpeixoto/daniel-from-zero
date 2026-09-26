import type { PricingInput } from "@/lib/pricing";
import { Field, inputClassName } from "./Field";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

function parseNum(raw: string): number {
  const v = Number(raw.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

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
          <input
            id="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={value.quantity}
            onChange={(e) =>
              onChange({
                ...value,
                quantity: Math.max(1, Math.floor(parseNum(e.target.value)) || 1),
              })
            }
            className={inputClassName}
          />
        </Field>

        <div>
          <p className="mb-1.5 text-[0.875rem] font-medium text-[var(--color-ink)]">
            Tempo de impressão
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field id="print-hours" label="Horas">
              <input
                id="print-hours"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={value.printing.hours}
                onChange={(e) =>
                  onChange({
                    ...value,
                    printing: {
                      ...value.printing,
                      hours: Math.max(0, Math.floor(parseNum(e.target.value))),
                    },
                  })
                }
                className={inputClassName}
              />
            </Field>
            <Field id="print-minutes" label="Minutos">
              <input
                id="print-minutes"
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                step={1}
                value={value.printing.minutes}
                onChange={(e) =>
                  onChange({
                    ...value,
                    printing: {
                      ...value.printing,
                      minutes: Math.max(
                        0,
                        Math.min(59, Math.floor(parseNum(e.target.value))),
                      ),
                    },
                  })
                }
                className={inputClassName}
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
