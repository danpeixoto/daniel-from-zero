import type { PricingInput } from "@/lib/pricing";
import { AdditionalCostsList } from "./AdditionalCostsList";
import { Field } from "./Field";
import { DecimalInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

export function AdvancedSettings({ value, onChange }: Props) {
  return (
    <details className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
      <summary className="cursor-pointer font-[family-name:var(--font-display)] text-lg font-semibold">
        Configurações avançadas
      </summary>
      <div className="mt-6 flex flex-col gap-8">
        <Field
          id="machine-hourly-cost"
          label="Custo da máquina por hora (R$/h)"
          hint="Se não souber, comece entre R$ 1,00 e R$ 2,00 por hora."
          tooltip="Esse valor representa desgaste, manutenção e depreciação da impressora. Ele é diferente do custo de energia."
        >
          <DecimalInput
            id="machine-hourly-cost"
            min={0}
            maxFractionDigits={2}
            value={value.printing.machineHourlyCost}
            onChange={(machineHourlyCost) =>
              onChange({
                ...value,
                printing: { ...value.printing, machineHourlyCost },
              })
            }
          />
        </Field>

        <AdditionalCostsList value={value} onChange={onChange} />

        <Field
          id="waste-percentage"
          label="Perdas / desperdício (%)"
          hint="Padrão sugerido: 10%."
          tooltip="Compensa falhas, retrabalho, sobras de filamento e peças que não saem boas. Aplica um percentual sobre o subtotal dos custos."
        >
          <DecimalInput
            id="waste-percentage"
            min={0}
            maxFractionDigits={2}
            value={value.wastePercentage}
            onChange={(wastePercentage) =>
              onChange({ ...value, wastePercentage })
            }
          />
        </Field>

        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
              Taxas na venda
            </h3>
            <p className="mt-1 text-[0.8125rem] text-[var(--color-ink-muted)]">
              Impostos e taxas do marketplace ou do pagamento entram no preço de
              venda, não no custo de produção. A soma da margem desejada e destas
              taxas precisa ser menor que 100%.
            </p>
          </div>

          <Field
            id="fee-tax"
            label="Impostos (%)"
            tooltip="Percentual de impostos sobre o preço de venda (ex.: Simples, ISS). Use 0 se não se aplicar."
          >
            <DecimalInput
              id="fee-tax"
              min={0}
              maxFractionDigits={2}
              value={value.fees.tax}
              onChange={(tax) =>
                onChange({ ...value, fees: { ...value.fees, tax } })
              }
            />
          </Field>

          <Field
            id="fee-marketplace"
            label="Taxa marketplace (%)"
            tooltip="Comissão de plataformas como Mercado Livre, Shopee ou similar sobre o preço de venda."
          >
            <DecimalInput
              id="fee-marketplace"
              min={0}
              maxFractionDigits={2}
              value={value.fees.marketplace}
              onChange={(marketplace) =>
                onChange({ ...value, fees: { ...value.fees, marketplace } })
              }
            />
          </Field>

          <Field
            id="fee-payment"
            label="Taxa de pagamento (%)"
            tooltip="Taxa de cartão, Pix intermediado ou gateway de pagamento sobre o valor da venda."
          >
            <DecimalInput
              id="fee-payment"
              min={0}
              maxFractionDigits={2}
              value={value.fees.payment}
              onChange={(payment) =>
                onChange({ ...value, fees: { ...value.fees, payment } })
              }
            />
          </Field>
        </div>
      </div>
    </details>
  );
}
