import type { PricingInput } from "@/lib/pricing";
import { Field } from "./Field";
import { DecimalInput, IntegerInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

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
              <IntegerInput
                id="labor-hours"
                min={0}
                value={value.labor.hours}
                onChange={(hours) =>
                  onChange({
                    ...value,
                    labor: { ...value.labor, hours },
                  })
                }
              />
            </Field>
            <Field id="labor-minutes" label="Minutos">
              <IntegerInput
                id="labor-minutes"
                min={0}
                max={59}
                value={value.labor.minutes}
                onChange={(minutes) =>
                  onChange({
                    ...value,
                    labor: { ...value.labor, minutes },
                  })
                }
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
          <DecimalInput
            id="hourly-rate"
            min={0}
            maxFractionDigits={2}
            value={value.labor.hourlyRate}
            onChange={(hourlyRate) =>
              onChange({
                ...value,
                labor: { ...value.labor, hourlyRate },
              })
            }
          />
        </Field>
      </div>
    </section>
  );
}
