"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { formatBRL, formatPercent } from "@/lib/format";
import {
  buildSummaryText,
  type PricingInput,
  type PricingResult,
} from "@/lib/pricing";
import { HelpTooltip } from "./HelpTooltip";

type Props = {
  input: PricingInput;
  result: PricingResult;
  onClear: () => void;
};

function formatMarkup(markup: number): string {
  if (!Number.isFinite(markup) || markup <= 0) return "0x";
  return `${markup.toFixed(2).replace(".", ",")}x`;
}

function barWidthPercent(value: number, base: number): number {
  if (!Number.isFinite(value) || value <= 0 || base <= 0) return 0;
  return Math.min(100, (value / base) * 100);
}

export function PricingSummary({ input, result, onClear }: Props) {
  const [copied, setCopied] = useState(false);
  const { costs, pricing } = result;
  const quantity = Math.max(1, Math.floor(input.quantity) || 1);
  const isValid = result.valid;

  const composition = [
    { label: "Material", value: costs.filament },
    { label: "Energia", value: costs.electricity },
    { label: "Máquina", value: costs.machine },
    { label: "Mão de obra", value: costs.labor },
    { label: "Embalagem", value: costs.packaging },
    { label: "Outros", value: costs.additional },
  ];
  const subtotalBase = costs.subtotal > 0 ? costs.subtotal : 0;
  const maxSlice = Math.max(...composition.map((c) => c.value), 0);

  async function handleCopy() {
    if (!isValid) return;
    try {
      await navigator.clipboard.writeText(buildSummaryText(input, result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
        <p className="text-sm text-[var(--color-ink-muted)]">Preço recomendado</p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[1.75rem] font-medium leading-tight tracking-tight text-[var(--color-accent)]">
          {isValid ? (
            <>
              {formatBRL(pricing.salePricePerUnit)}
              <span className="text-base text-[var(--color-ink-muted)]">/un</span>
            </>
          ) : (
            "—"
          )}
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Total do pedido:{" "}
          <span className="font-[family-name:var(--font-mono)] text-[var(--color-ink)]">
            {isValid ? formatBRL(pricing.salePriceTotal) : "—"}
          </span>{" "}
          ({quantity} {quantity === 1 ? "unidade" : "unidades"})
        </p>

        {!result.valid && result.error ? (
          <div
            role="alert"
            className="mt-4 rounded-[12px] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]"
          >
            {result.error}
          </div>
        ) : null}

        <ul className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6">
          <li>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              Custo real
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[var(--color-ink)]">
              {formatBRL(pricing.costPerUnit)}/un
            </p>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Cobre só os custos estimados
            </p>
          </li>
          <li>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              Preço recomendado
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[var(--color-ink)]">
              {isValid ? `${formatBRL(pricing.salePricePerUnit)}/un` : "—"}
            </p>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Custos + taxas + margem
            </p>
          </li>
          <li>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              Preço arredondado sugerido
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[var(--color-ink)]">
              {isValid ? `${formatBRL(pricing.roundedPricePerUnit)}/un` : "—"}
            </p>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Arredondamento comercial para cima
            </p>
          </li>
        </ul>

        <div className="mt-6 border-t border-[var(--color-border)] pt-6">
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
            Composição do custo
          </h3>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            {(
              [
                ["Filamento", costs.filament],
                ["Energia", costs.electricity],
                ["Uso da máquina", costs.machine],
                ["Mão de obra", costs.labor],
                ["Embalagem", costs.packaging],
                ["Outros custos", costs.additional],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">{label}</dt>
                <dd className="font-[family-name:var(--font-mono)] tabular-nums">
                  {formatBRL(value)}
                </dd>
              </div>
            ))}
            <div className="mt-1 flex justify-between gap-4 border-t border-[var(--color-border)] pt-2">
              <dt className="text-[var(--color-ink-muted)]">Subtotal</dt>
              <dd className="font-[family-name:var(--font-mono)] tabular-nums">
                {formatBRL(costs.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">
                Perdas ({formatPercent(input.wastePercentage)})
              </dt>
              <dd className="font-[family-name:var(--font-mono)] tabular-nums">
                {formatBRL(costs.wasteAmount)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 font-medium">
              <dt>Custo total</dt>
              <dd className="font-[family-name:var(--font-mono)] tabular-nums text-[var(--color-accent)]">
                {formatBRL(costs.total)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 border-t border-[var(--color-border)] pt-6">
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">
            Distribuição
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {composition.map((item) => {
              const width = barWidthPercent(item.value, subtotalBase);
              const isMax = item.value === maxSlice && maxSlice > 0;
              return (
                <li key={item.label}>
                  <div className="mb-1 flex justify-between gap-2 text-[0.8125rem]">
                    <span className="text-[var(--color-ink-muted)]">
                      {item.label}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] tabular-nums">
                      {subtotalBase > 0
                        ? formatPercent((item.value / subtotalBase) * 100)
                        : "0%"}
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-border)]"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-[var(--radius-pill)] transition-[width] duration-200"
                      style={{
                        width: `${width}%`,
                        backgroundColor: isMax
                          ? "var(--color-accent)"
                          : "var(--color-ink-muted)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-6">
          <div>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Faturamento
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-sm tabular-nums">
              {isValid ? formatBRL(pricing.revenue) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Lucro estimado
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-sm tabular-nums">
              {isValid ? formatBRL(pricing.profitTotal) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Margem efetiva
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-sm tabular-nums">
              {isValid ? formatPercent(pricing.effectiveMargin * 100) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
              Markup
              <HelpTooltip label="markup">
                Markup é quantas vezes o preço cobre o custo (ex.: 1,67x). Margem
                é o lucro sobre o preço de venda — não são a mesma coisa.
              </HelpTooltip>
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-sm tabular-nums">
              {isValid ? formatMarkup(pricing.markup) : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row">
          <Button
            type="button"
            onClick={handleCopy}
            disabled={!isValid}
            className="sm:flex-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {copied ? "Copiado" : "Copiar resumo"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            className="sm:flex-1"
          >
            Limpar calculadora
          </Button>
        </div>
      </div>
    </aside>
  );
}
