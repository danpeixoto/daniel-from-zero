"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import {
  STORAGE_KEY,
  applyBeginnerPreset,
  calculatePricing,
  createDefaultInput,
  type PricingInput,
} from "@/lib/pricing";
import { AdvancedSettings } from "./AdvancedSettings";
import { FilamentSection } from "./FilamentSection";
import { LaborSection } from "./LaborSection";
import { MarginSection } from "./MarginSection";
import { PackagingSection } from "./PackagingSection";
import { PricingSummary } from "./PricingSummary";
import { PrinterSection } from "./PrinterSection";
import { ProductionSection } from "./ProductionSection";

function mergeStoredInput(parsed: Partial<PricingInput>): PricingInput {
  const defaults = createDefaultInput();
  return {
    ...defaults,
    ...parsed,
    filament: { ...defaults.filament, ...parsed.filament },
    printing: { ...defaults.printing, ...parsed.printing },
    labor: { ...defaults.labor, ...parsed.labor },
    fees: { ...defaults.fees, ...parsed.fees },
    packaging: { ...defaults.packaging, ...parsed.packaging },
    additionalCosts: Array.isArray(parsed.additionalCosts)
      ? parsed.additionalCosts
      : defaults.additionalCosts,
  };
}

export function PricingCalculator() {
  const [input, setInput] = useState<PricingInput>(createDefaultInput);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate after mount to avoid SSR mismatch; defer setState for the hooks lint.
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PricingInput>;
          setInput(mergeStoredInput(parsed));
        }
      } catch {
        /* ignore corrupt storage */
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  }, [input, hydrated]);

  const result = calculatePricing(input);

  function clearAll() {
    const next = createDefaultInput();
    setInput(next);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setInput((v) => applyBeginnerPreset(v))}
          >
            Perfil iniciante
          </Button>
          <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">
            Aplica desperdício 10%, máquina R$ 1,50/h e margem 40%.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={clearAll}>
          Limpar todos os campos
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-6">
          <ProductionSection value={input} onChange={setInput} />
          <FilamentSection value={input} onChange={setInput} />
          <PrinterSection value={input} onChange={setInput} />
          <LaborSection value={input} onChange={setInput} />
          <PackagingSection value={input} onChange={setInput} />
          <MarginSection value={input} onChange={setInput} />
          <AdvancedSettings value={input} onChange={setInput} />
        </div>
        <PricingSummary input={input} result={result} onClear={clearAll} />
      </div>
    </div>
  );
}
