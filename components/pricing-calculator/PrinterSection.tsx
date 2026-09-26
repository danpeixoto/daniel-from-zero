import type { PricingInput } from "@/lib/pricing";
import { Field } from "./Field";
import { DecimalInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

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
          <DecimalInput
            id="average-watts"
            min={0}
            maxFractionDigits={1}
            value={value.printing.averageWatts}
            onChange={(averageWatts) =>
              onChange({
                ...value,
                printing: { ...value.printing, averageWatts },
              })
            }
          />
        </Field>

        <Field
          id="electricity-price"
          label="Tarifa de energia (R$/kWh)"
          hint="Olhe na sua conta de luz o valor do kWh."
          tooltip="Preço que você paga por quilowatt-hora. Entra no cálculo do custo de energia da impressão."
        >
          <DecimalInput
            id="electricity-price"
            min={0}
            maxFractionDigits={4}
            value={value.printing.electricityPrice}
            onChange={(electricityPrice) =>
              onChange({
                ...value,
                printing: { ...value.printing, electricityPrice },
              })
            }
          />
        </Field>
      </div>
    </section>
  );
}
