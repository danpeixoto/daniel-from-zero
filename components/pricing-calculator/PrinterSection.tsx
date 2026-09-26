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

export function PrinterSection({ value, onChange }: Props) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        Impressora
      </h2>
      <div className="mt-6 flex flex-col gap-5">
        <Field
          id="average-watts"
          label="Consumo médio (W)"
          hint="A maioria das impressoras FDM fica entre 100 e 150 W."
          tooltip="Potência média durante a impressão. Se não souber, use 120 W como ponto de partida."
        >
          <input
            id="average-watts"
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={value.printing.averageWatts}
            onChange={(e) =>
              onChange({
                ...value,
                printing: {
                  ...value.printing,
                  averageWatts: Math.max(0, parseNum(e.target.value)),
                },
              })
            }
            className={inputClassName}
          />
        </Field>

        <Field
          id="electricity-price"
          label="Tarifa de energia (R$/kWh)"
          hint="Olhe na sua conta de luz o valor do kWh."
          tooltip="Preço que você paga por quilowatt-hora. Entra no cálculo do custo de energia da impressão."
        >
          <input
            id="electricity-price"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={value.printing.electricityPrice}
            onChange={(e) =>
              onChange({
                ...value,
                printing: {
                  ...value.printing,
                  electricityPrice: Math.max(0, parseNum(e.target.value)),
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
