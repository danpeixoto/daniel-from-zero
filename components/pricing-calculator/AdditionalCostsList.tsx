import type { AdditionalCost, PricingInput } from "@/lib/pricing";
import { Field, inputClassName } from "./Field";
import { DecimalInput } from "./NumericInput";

type Props = {
  value: PricingInput;
  onChange: (next: PricingInput) => void;
};

function updateCost(
  costs: AdditionalCost[],
  id: string,
  patch: Partial<AdditionalCost>,
): AdditionalCost[] {
  return costs.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function AdditionalCostsList({ value, onChange }: Props) {
  const costs = value.additionalCosts;

  function addCost() {
    onChange({
      ...value,
      additionalCosts: [
        ...costs,
        { id: crypto.randomUUID(), name: "", value: 0, type: "unit" },
      ],
    });
  }

  function removeCost(id: string) {
    onChange({
      ...value,
      additionalCosts: costs.filter((item) => item.id !== id),
    });
  }

  function setCosts(next: AdditionalCost[]) {
    onChange({ ...value, additionalCosts: next });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
          Outros custos
        </h3>
        <p className="mt-1 text-[0.8125rem] text-[var(--color-ink-muted)]">
          Correntes, ímãs, parafusos, cola, insertos ou qualquer extra além da
          embalagem.
        </p>
      </div>

      {costs.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {costs.map((item, index) => {
            const nameId = `additional-name-${item.id}`;
            const typeId = `additional-type-${item.id}`;
            const valueId = `additional-value-${item.id}`;

            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-[12px] border border-[var(--color-border)] p-4"
              >
                <Field id={nameId} label={`Descrição ${index + 1}`}>
                  <input
                    id={nameId}
                    type="text"
                    value={item.name}
                    placeholder="Ex.: corrente de chaveiro"
                    onChange={(e) =>
                      setCosts(
                        updateCost(costs, item.id, { name: e.target.value }),
                      )
                    }
                    className={inputClassName}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field id={typeId} label="Tipo">
                    <select
                      id={typeId}
                      value={item.type}
                      onChange={(e) =>
                        setCosts(
                          updateCost(costs, item.id, {
                            type: e.target.value as AdditionalCost["type"],
                          }),
                        )
                      }
                      className={inputClassName}
                    >
                      <option value="unit">Por unidade</option>
                      <option value="total">Valor total</option>
                    </select>
                  </Field>

                  <Field id={valueId} label="Valor (R$)">
                    <DecimalInput
                      id={valueId}
                      min={0}
                      maxFractionDigits={2}
                      value={item.value}
                      onChange={(next) =>
                        setCosts(updateCost(costs, item.id, { value: next }))
                      }
                    />
                  </Field>
                </div>

                <button
                  type="button"
                  onClick={() => removeCost(item.id)}
                  className="self-start text-[0.875rem] font-medium text-[var(--color-danger)] hover:underline underline-offset-4"
                >
                  Remover
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={addCost}
        className="inline-flex min-h-10 w-fit items-center justify-center rounded-[var(--radius-btn)] border-[1.5px] border-[var(--color-border)] bg-transparent px-4 py-2 text-[0.875rem] font-medium text-[var(--color-ink)] transition duration-200 hover:border-[var(--color-accent)]"
      >
        + Adicionar custo
      </button>
    </div>
  );
}
