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

export function LaborSection({ value, onChange }: Props) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        Mão de obra
      </h2>
      <p className="mt-2 text-[0.875rem] text-[var(--color-ink-muted)]">
        O tempo da impressora não é o mesmo que seu tempo de trabalho.
      </p>
      <div className="mt-6 flex flex-col gap-5">
        <div>
          <p className="mb-1.5 text-[0.875rem] font-medium text-[var(--color-ink)]">
            Tempo manual
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field id="labor-hours" label="Horas">
              <input
                id="labor-hours"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={value.labor.hours}
                onChange={(e) =>
                  onChange({
                    ...value,
                    labor: {
                      ...value.labor,
                      hours: Math.max(0, Math.floor(parseNum(e.target.value))),
                    },
                  })
                }
                className={inputClassName}
              />
            </Field>
            <Field id="labor-minutes" label="Minutos">
              <input
                id="labor-minutes"
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                step={1}
                value={value.labor.minutes}
                onChange={(e) =>
                  onChange({
                    ...value,
                    labor: {
                      ...value.labor,
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
            Preparação, remoção de suporte, acabamento e embalagem.
          </p>
        </div>

        <Field
          id="hourly-rate"
          label="Valor da sua hora (R$)"
          tooltip="Quanto você considera valer uma hora do seu trabalho neste pedido."
        >
          <input
            id="hourly-rate"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={value.labor.hourlyRate}
            onChange={(e) =>
              onChange({
                ...value,
                labor: {
                  ...value.labor,
                  hourlyRate: Math.max(0, parseNum(e.target.value)),
                },
              })
            }
            className={inputClassName}
          />
        </Field>
      </div>
    </section>
  );
}
