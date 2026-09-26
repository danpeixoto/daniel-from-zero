# Calculadora de Precificação de Impressão 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a página `/ferramentas/calculadora-impressao-3d` com cálculo correto em tempo real, UX progressiva e visual alinhado ao design system Daniel From Zero, pronta para demo no YouTube.

**Architecture:** Shell RSC (SEO + texto educativo) + client `PricingCalculator`. Funções puras em `lib/pricing.ts` e formatação em `lib/format.ts`. Seções do formulário e resumo sticky em `components/pricing-calculator/`. Persistência `localStorage` (`dfz-pricing-v1`). Sem backend e sem lib de gráficos.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, CSS variables do projeto. Verificação do benchmark via `npx tsx` (sem adicionar runner ao `package.json`).

**Spec:** `docs/superpowers/specs/2026-09-25-calculadora-impressao-3d-design.md`

## Global Constraints

- Branch: `feat/calculadora-impressao-3d` (já existe; não criar outra)
- Design tokens: apenas variáveis de `globals.css` / design system DFZ — nunca hardcode de cores fora dos tokens
- Sem emojis na UI; ícones de ajuda = `?` tipográfico ou SVG line (Lucide só se já estiver no projeto — hoje não está, então `?` em botão)
- Sem gradients; dark mode padrão; números em `--font-mono`; preço principal em `--color-accent`
- Formatação `pt-BR` / BRL via `Intl.NumberFormat`
- Campos vazios = `0`; quantidade mínima `1`; peso do rolo deve ser `> 0`
- Progressive disclosure A: avançado colapsado; arredondamento D (steps 0.10 / 0.50 / 1.00)
- Não adicionar Vitest/Jest/Playwright ao projeto
- Microcopy direto, sem tom de guru
- Commits frequentes por task; mensagem em inglês imperativo curto ou estilo do repo

## File map

| Path | Responsibility |
|------|----------------|
| `lib/format.ts` | `formatBRL`, `formatPercent`, `formatGrams`, `formatDuration` |
| `lib/pricing.ts` | Types, defaults, preset, `calculatePricing`, `roundCommercialPrice`, `buildSummaryText` |
| `scripts/verify-pricing.ts` | Assert do benchmark do brief (rodar com `npx tsx`, não commit obrigatório no package.json) |
| `components/pricing-calculator/Field.tsx` | Label + input + hint + erro |
| `components/pricing-calculator/HelpTooltip.tsx` | Botão `?` acessível |
| `components/pricing-calculator/*Section.tsx` | Blocos do formulário |
| `components/pricing-calculator/AdditionalCostsList.tsx` | Linhas dinâmicas |
| `components/pricing-calculator/AdvancedSettings.tsx` | `<details>` com avançados |
| `components/pricing-calculator/PricingSummary.tsx` | Sticky result |
| `components/pricing-calculator/PricingCalculator.tsx` | Estado, localStorage, layout |
| `app/ferramentas/calculadora-impressao-3d/page.tsx` | RSC + metadata + SEO copy |
| `app/ferramentas/page.tsx` | Link real da ferramenta |
| `app/page.tsx` | Card home atualizado |
| `app/sitemap.ts` | Incluir nova URL |

---

### Task 1: Format helpers (`lib/format.ts`)

**Files:**
- Create: `lib/format.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `formatBRL(value: number): string`
  - `formatPercent(value: number): string` — `value` já em pontos percentuais (ex.: `40` → `"40%"`)
  - `formatGrams(value: number): string`
  - `formatDuration(hours: number, minutes: number): string` — ex.: `"3h 25min"`, `"30min"`, `"2h"`

- [ ] **Step 1: Create `lib/format.ts`**

```ts
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberPt = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

export function formatBRL(value: number): string {
  if (!Number.isFinite(value)) return currency.format(0);
  return currency.format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%";
  return `${numberPt.format(value)}%`;
}

export function formatGrams(value: number): string {
  if (!Number.isFinite(value)) return "0 g";
  return `${numberPt.format(value)} g`;
}

export function formatDuration(hours: number, minutes: number): string {
  const h = Number.isFinite(hours) ? Math.max(0, Math.floor(hours)) : 0;
  const m = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;
  if (h === 0 && m === 0) return "0min";
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
```

- [ ] **Step 2: Sanity-check in Node**

Run:

```bash
npx --yes tsx -e "import { formatBRL, formatPercent, formatDuration } from './lib/format.ts'; console.log(formatBRL(1234.56), formatPercent(40), formatDuration(3,25))"
```

Expected stdout contains: `R$ 1.234,56` `40%` `3h 25min`

- [ ] **Step 3: Commit**

```bash
git add lib/format.ts
git commit -m "feat: add pt-BR format helpers for pricing calculator"
```

---

### Task 2: Pricing engine (`lib/pricing.ts`) + benchmark verify

**Files:**
- Create: `lib/pricing.ts`
- Create: `scripts/verify-pricing.ts`

**Interfaces:**
- Consumes: nothing from Task 1 (formatting stays in UI)
- Produces types and functions below (exact names — UI tasks depend on these)

```ts
export type AdditionalCost = {
  id: string;
  name: string;
  value: number;
  type: "unit" | "total";
};

export type PricingInput = {
  quantity: number;
  filament: {
    spoolPrice: number;
    spoolWeight: number;
    usedWeight: number;
  };
  printing: {
    hours: number;
    minutes: number;
    averageWatts: number;
    electricityPrice: number;
    machineHourlyCost: number;
  };
  labor: {
    hours: number;
    minutes: number;
    hourlyRate: number;
  };
  wastePercentage: number;
  fees: {
    tax: number;
    marketplace: number;
    payment: number;
  };
  desiredMargin: number;
  additionalCosts: AdditionalCost[];
};

export type PricingResult = {
  valid: boolean;
  error: string | null;
  printHours: number;
  laborHours: number;
  costs: {
    filament: number;
    electricity: number;
    machine: number;
    labor: number;
    additional: number;
    subtotal: number;
    wasteAmount: number;
    total: number;
  };
  pricing: {
    costPerUnit: number;
    salePriceTotal: number;
    salePricePerUnit: number;
    roundedPricePerUnit: number;
    revenue: number;
    feesAmount: number;
    profitTotal: number;
    profitPerUnit: number;
    effectiveMargin: number; // 0–1
    markup: number; // ratio, e.g. 1.67
  };
};

export const STORAGE_KEY = "dfz-pricing-v1";

export function createDefaultInput(): PricingInput;
export function applyBeginnerPreset(input: PricingInput): PricingInput;
export function roundCommercialPrice(unitPrice: number): number;
export function calculatePricing(input: PricingInput): PricingResult;
export function buildSummaryText(input: PricingInput, result: PricingResult): string;
export const BENCHMARK_INPUT: PricingInput; // for verify script
```

- [ ] **Step 1: Write failing verify script first**

Create `scripts/verify-pricing.ts`:

```ts
import {
  BENCHMARK_INPUT,
  calculatePricing,
  roundCommercialPrice,
} from "../lib/pricing";

const r = calculatePricing(BENCHMARK_INPUT);

function approx(actual: number, expected: number, tol = 0.02) {
  if (Math.abs(actual - expected) > tol) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

if (!r.valid) throw new Error(r.error ?? "invalid");
approx(r.costs.filament, 100);
approx(r.costs.electricity, 3.6);
approx(r.costs.machine, 45);
approx(r.costs.labor, 60);
approx(r.costs.additional, 25);
approx(r.costs.subtotal, 233.6);
approx(r.costs.total, 256.96);
approx(r.pricing.salePriceTotal, 428.27);
approx(r.pricing.salePricePerUnit, 8.5654, 0.01);
approx(roundCommercialPrice(8.5654), 8.6);

console.log("verify-pricing: OK");
```

- [ ] **Step 2: Run verify — expect FAIL (module missing)**

Run: `npx --yes tsx scripts/verify-pricing.ts`  
Expected: error resolving `../lib/pricing`

- [ ] **Step 3: Implement `lib/pricing.ts`**

```ts
export type AdditionalCost = {
  id: string;
  name: string;
  value: number;
  type: "unit" | "total";
};

export type PricingInput = {
  quantity: number;
  filament: {
    spoolPrice: number;
    spoolWeight: number;
    usedWeight: number;
  };
  printing: {
    hours: number;
    minutes: number;
    averageWatts: number;
    electricityPrice: number;
    machineHourlyCost: number;
  };
  labor: {
    hours: number;
    minutes: number;
    hourlyRate: number;
  };
  wastePercentage: number;
  fees: {
    tax: number;
    marketplace: number;
    payment: number;
  };
  desiredMargin: number;
  additionalCosts: AdditionalCost[];
};

export type PricingResult = {
  valid: boolean;
  error: string | null;
  printHours: number;
  laborHours: number;
  costs: {
    filament: number;
    electricity: number;
    machine: number;
    labor: number;
    additional: number;
    subtotal: number;
    wasteAmount: number;
    total: number;
  };
  pricing: {
    costPerUnit: number;
    salePriceTotal: number;
    salePricePerUnit: number;
    roundedPricePerUnit: number;
    revenue: number;
    feesAmount: number;
    profitTotal: number;
    profitPerUnit: number;
    effectiveMargin: number;
    markup: number;
  };
};

export const STORAGE_KEY = "dfz-pricing-v1";

function n(value: unknown): number {
  const x = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(x) || x < 0) return 0;
  return x;
}

function hoursFrom(h: number, m: number): number {
  return n(h) + n(m) / 60;
}

export function createDefaultInput(): PricingInput {
  return {
    quantity: 1,
    filament: { spoolPrice: 0, spoolWeight: 1000, usedWeight: 0 },
    printing: {
      hours: 0,
      minutes: 0,
      averageWatts: 0,
      electricityPrice: 0,
      machineHourlyCost: 0,
    },
    labor: { hours: 0, minutes: 0, hourlyRate: 0 },
    wastePercentage: 10,
    fees: { tax: 0, marketplace: 0, payment: 0 },
    desiredMargin: 40,
    additionalCosts: [],
  };
}

export function applyBeginnerPreset(input: PricingInput): PricingInput {
  return {
    ...input,
    wastePercentage: 10,
    desiredMargin: 40,
    printing: { ...input.printing, machineHourlyCost: 1.5 },
  };
}

/** Round UP to commercial step: <20 → 0.10; <100 → 0.50; else 1.00 */
export function roundCommercialPrice(unitPrice: number): number {
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return 0;
  const step = unitPrice < 20 ? 0.1 : unitPrice < 100 ? 0.5 : 1;
  return Math.ceil(unitPrice / step - 1e-9) * step;
}

export function calculatePricing(input: PricingInput): PricingResult {
  const quantity = Math.max(1, Math.floor(n(input.quantity) || 1));
  const spoolWeight = n(input.filament.spoolWeight);
  const spoolPrice = n(input.filament.spoolPrice);
  const usedWeight = n(input.filament.usedWeight);

  const printHours = hoursFrom(input.printing.hours, input.printing.minutes);
  const laborHours = hoursFrom(input.labor.hours, input.labor.minutes);

  const filament =
    spoolWeight > 0 ? (spoolPrice / spoolWeight) * usedWeight : 0;
  const electricity =
    (n(input.printing.averageWatts) / 1000) *
    printHours *
    n(input.printing.electricityPrice);
  const machine = printHours * n(input.printing.machineHourlyCost);
  const labor = laborHours * n(input.labor.hourlyRate);
  const additional = input.additionalCosts.reduce((sum, item) => {
    const value = n(item.value);
    return sum + (item.type === "unit" ? value * quantity : value);
  }, 0);

  const subtotal = filament + electricity + machine + labor + additional;
  const wastePct = n(input.wastePercentage) / 100;
  const total = subtotal * (1 + wastePct);
  const wasteAmount = total - subtotal;

  const margin = n(input.desiredMargin) / 100;
  const feesPct =
    (n(input.fees.tax) +
      n(input.fees.marketplace) +
      n(input.fees.payment)) /
    100;

  const emptyPricing = {
    costPerUnit: quantity > 0 ? total / quantity : 0,
    salePriceTotal: 0,
    salePricePerUnit: 0,
    roundedPricePerUnit: 0,
    revenue: 0,
    feesAmount: 0,
    profitTotal: 0,
    profitPerUnit: 0,
    effectiveMargin: 0,
    markup: 0,
  };

  const base = {
    printHours,
    laborHours,
    costs: {
      filament,
      electricity,
      machine,
      labor,
      additional,
      subtotal,
      wasteAmount,
      total,
    },
  };

  if (margin + feesPct >= 1) {
    return {
      valid: false,
      error:
        "A soma da margem desejada e das taxas precisa ser menor que 100%.",
      ...base,
      pricing: emptyPricing,
    };
  }

  const salePriceTotal = total / (1 - margin - feesPct);
  const salePricePerUnit = salePriceTotal / quantity;
  const roundedPricePerUnit = roundCommercialPrice(salePricePerUnit);
  const revenue = salePriceTotal;
  const feesAmount = revenue * feesPct;
  const profitTotal = revenue - total - feesAmount;
  const profitPerUnit = profitTotal / quantity;
  const effectiveMargin = revenue > 0 ? profitTotal / revenue : 0;
  const markup = total > 0 ? salePriceTotal / total : 0;

  return {
    valid: true,
    error: null,
    ...base,
    pricing: {
      costPerUnit: total / quantity,
      salePriceTotal,
      salePricePerUnit,
      roundedPricePerUnit,
      revenue,
      feesAmount,
      profitTotal,
      profitPerUnit,
      effectiveMargin,
      markup,
    },
  };
}

// At file top: import { formatBRL } from "./format";
export function buildSummaryText(
  input: PricingInput,
  result: PricingResult,
): string {
  const q = Math.max(1, Math.floor(n(input.quantity) || 1));
  return [
    "Precificação da impressão 3D",
    "",
    `Quantidade: ${q} unidades`,
    `Custo total: ${formatBRL(result.costs.total)}`,
    `Custo por unidade: ${formatBRL(result.pricing.costPerUnit)}`,
    `Preço sugerido: ${formatBRL(result.pricing.salePricePerUnit)}/un`,
    `Total do pedido: ${formatBRL(result.pricing.salePriceTotal)}`,
    `Margem: ${n(input.desiredMargin)}%`,
  ].join("\n");
}

export const BENCHMARK_INPUT: PricingInput = {
  quantity: 50,
  filament: { spoolPrice: 100, spoolWeight: 1000, usedWeight: 1000 },
  printing: {
    hours: 30,
    minutes: 0,
    averageWatts: 120,
    electricityPrice: 1,
    machineHourlyCost: 1.5,
  },
  labor: { hours: 2, minutes: 0, hourlyRate: 30 },
  wastePercentage: 10,
  fees: { tax: 0, marketplace: 0, payment: 0 },
  desiredMargin: 40,
  additionalCosts: [
    { id: "bench-1", name: "Corrente", value: 0.5, type: "unit" },
  ],
};
```

- [ ] **Step 4: Run verify — expect PASS**

Run: `npx --yes tsx scripts/verify-pricing.ts`  
Expected: `verify-pricing: OK`

- [ ] **Step 5: Commit**

```bash
git add lib/pricing.ts scripts/verify-pricing.ts
git commit -m "feat: add pure 3D print pricing calculation engine"
```

---

### Task 3: `Field` + `HelpTooltip`

**Files:**
- Create: `components/pricing-calculator/HelpTooltip.tsx`
- Create: `components/pricing-calculator/Field.tsx`

**Interfaces:**
- Consumes: design tokens via CSS vars
- Produces:
  - `HelpTooltip({ label, children }: { label: string; children: React.ReactNode })`
  - `Field` props: `id`, `label`, `hint?`, `tooltip?`, `error?`, `suffix?`, `children` (o input) **ou** props de input controlado: `type`, `value`, `onChange`, `min`, `step`, `inputMode`, `placeholder`

Implementação recomendada: `Field` renderiza label+tooltip+hint+erro e aceita `children` como o controle, para flexibilidade (pares hora/minuto).

- [ ] **Step 1: Create `HelpTooltip.tsx` (client)**

```tsx
"use client";

import { useId, useState } from "react";

type Props = {
  label: string;
  children: React.ReactNode;
};

export function HelpTooltip({ label, children }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        className="ml-1 inline-flex size-5 items-center justify-center rounded-full border border-[var(--color-border)] font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        aria-label={`Ajuda: ${label}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-left text-[0.8125rem] leading-snug text-[var(--color-ink-muted)] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
```

- [ ] **Step 2: Create `Field.tsx`**

```tsx
import type { ReactNode } from "react";
import { HelpTooltip } from "./HelpTooltip";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  tooltip?: ReactNode;
  error?: string;
  children: ReactNode;
};

export function Field({ id, label, hint, tooltip, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.875rem] font-medium text-[var(--color-ink)]"
      >
        {label}
        {tooltip ? <HelpTooltip label={label}>{tooltip}</HelpTooltip> : null}
      </label>
      {children}
      {hint ? (
        <p className="text-[0.8125rem] text-[var(--color-ink-muted)]">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-[0.8125rem] text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClassName =
  "w-full min-h-10 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-[family-name:var(--font-mono)] text-[0.9375rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--color-accent)_30%,transparent)]";
```

- [ ] **Step 3: Commit**

```bash
git add components/pricing-calculator/HelpTooltip.tsx components/pricing-calculator/Field.tsx
git commit -m "feat: add Field and HelpTooltip for pricing calculator"
```

---

### Task 4: Form sections (visível)

**Files:**
- Create: `components/pricing-calculator/ProductionSection.tsx`
- Create: `components/pricing-calculator/FilamentSection.tsx`
- Create: `components/pricing-calculator/PrinterSection.tsx`
- Create: `components/pricing-calculator/LaborSection.tsx`
- Create: `components/pricing-calculator/MarginSection.tsx`

**Interfaces:**
- Consumes: `PricingInput`, `Field`, `inputClassName`, `formatBRL` (só Filament para custo ao vivo)
- Produces: cada seção recebe `value: PricingInput` + `onChange: (next: PricingInput) => void`

Padrão de card wrapper (repetir em todas):

```tsx
<section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
  <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">…</h2>
  …
</section>
```

Helper local sugerido em cada arquivo (ou extrair depois se repetir):

```ts
function parseNum(raw: string): number {
  const v = Number(raw.replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}
```

- [ ] **Step 1: `ProductionSection`** — quantidade (≥1), horas e minutos de impressão; hint: “Use o tempo estimado pelo seu slicer para produzir todo o pedido.”; tooltip quantidade: “Quantas unidades serão produzidas neste pedido.”

- [ ] **Step 2: `FilamentSection`** — preço do rolo, peso (default 1000), uso em g; mostrar `Custo estimado de filamento: {formatBRL(...)}` calculado inline `(spoolPrice/spoolWeight)*usedWeight` se peso > 0.

- [ ] **Step 3: `PrinterSection`** — apenas `averageWatts` e `electricityPrice`; hints do brief (100–150 W; R$/kWh). **Não** incluir `machineHourlyCost` aqui.

- [ ] **Step 4: `LaborSection`** — texto curto: “O tempo da impressora não é o mesmo que seu tempo de trabalho.”; campos tempo manual h/min + valor da hora.

- [ ] **Step 5: `MarginSection`** — `desiredMargin` default 40; tooltip margem vs markup com exemplo Custo 60 / Venda 100 / Lucro 40.

- [ ] **Step 6: Commit**

```bash
git add components/pricing-calculator/ProductionSection.tsx components/pricing-calculator/FilamentSection.tsx components/pricing-calculator/PrinterSection.tsx components/pricing-calculator/LaborSection.tsx components/pricing-calculator/MarginSection.tsx
git commit -m "feat: add visible pricing calculator form sections"
```

---

### Task 5: Advanced settings + additional costs

**Files:**
- Create: `components/pricing-calculator/AdditionalCostsList.tsx`
- Create: `components/pricing-calculator/AdvancedSettings.tsx`

**Interfaces:**
- Consumes: `AdditionalCost`, `PricingInput`
- Produces: UI para máquina R$/h, lista de custos, perdas %, taxas (tax/marketplace/payment)

- [ ] **Step 1: `AdditionalCostsList`**

- Botão “+ Adicionar custo” cria item `{ id: crypto.randomUUID(), name: "", value: 0, type: "unit" }`
- Cada linha: descrição (`name`), select tipo (`Por unidade` / `Valor total`), valor, botão remover
- Atualiza `input.additionalCosts` via `onChange`

- [ ] **Step 2: `AdvancedSettings`**

Usar `<details className="…">` colapsado por padrão:

```tsx
<details className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6">
  <summary className="cursor-pointer font-[family-name:var(--font-display)] text-lg font-semibold">
    Configurações avançadas
  </summary>
  <div className="mt-6 flex flex-col gap-8">
    {/* machineHourlyCost + tooltips do brief */}
    {/* AdditionalCostsList */}
    {/* wastePercentage default 10 */}
    {/* fees.tax, fees.marketplace, fees.payment + texto sobre taxas na venda */}
  </div>
</details>
```

- [ ] **Step 3: Commit**

```bash
git add components/pricing-calculator/AdditionalCostsList.tsx components/pricing-calculator/AdvancedSettings.tsx
git commit -m "feat: add advanced settings and dynamic additional costs"
```

---

### Task 6: `PricingSummary` (sticky result)

**Files:**
- Create: `components/pricing-calculator/PricingSummary.tsx`

**Interfaces:**
- Consumes: `PricingInput`, `PricingResult`, `formatBRL`, `formatPercent`, `buildSummaryText`
- Produces: resumo visual + ações Copiar / (Limpar fica no parent ou aqui — preferir props `onClear` e `onCopy` ou handlers internos)

Props:

```ts
type Props = {
  input: PricingInput;
  result: PricingResult;
  onClear: () => void;
};
```

- [ ] **Step 1: Implement summary UI**

Conteúdo obrigatório:

1. Headline **Preço recomendado** → `formatBRL(salePricePerUnit)` + `/un` (accent, mono, ~h2)
2. Linha: total do pedido (`salePriceTotal` + quantidade)
3. Se `!result.valid`: alert com `result.error`
4. Três refs: Custo real / Recomendado / Arredondado (com descrições curtas do brief)
5. Breakdown lista:
   - Filamento, Energia, Uso da máquina, Mão de obra, Custos adicionais
   - Subtotal, Perdas (valor + %), Custo total
6. Barras CSS: percentuais relativos ao `subtotal` (ou total) para Material / Energia / Máquina / Mão de obra / Outros — altura ou width bars, cor accent só na maior fatia ou cinza + accent na principal
7. Faturamento, lucro estimado, margem efetiva (`effectiveMargin * 100`), markup (`1,67x` via `Intl` ou `toFixed(2).replace('.', ',') + 'x'`)
8. Botões: `Copiar resumo` (`navigator.clipboard.writeText(buildSummaryText(...))` + feedback “Copiado”) e `Limpar calculadora` (`onClear`, variant secondary)

Layout sticky:

```tsx
<aside className="lg:sticky lg:top-24 lg:self-start …">
```

- [ ] **Step 2: Commit**

```bash
git add components/pricing-calculator/PricingSummary.tsx
git commit -m "feat: add sticky pricing summary with breakdown and copy"
```

---

### Task 7: `PricingCalculator` (state + layout)

**Files:**
- Create: `components/pricing-calculator/PricingCalculator.tsx`
- Optional barrel: `components/pricing-calculator/index.ts` exportando `PricingCalculator`

**Interfaces:**
- Consumes: all sections + `createDefaultInput`, `applyBeginnerPreset`, `calculatePricing`, `STORAGE_KEY`
- Produces: default export / named `PricingCalculator` client component

- [ ] **Step 1: Implement orchestrator**

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  STORAGE_KEY,
  applyBeginnerPreset,
  calculatePricing,
  createDefaultInput,
  type PricingInput,
} from "@/lib/pricing";
import { Button } from "@/components/Button";
// import sections + PricingSummary …

export function PricingCalculator() {
  const [input, setInput] = useState<PricingInput>(createDefaultInput);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PricingInput;
        setInput({ ...createDefaultInput(), ...parsed });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-6">
          {/* Production, Filament, Printer, Labor, Margin, AdvancedSettings */}
        </div>
        <PricingSummary input={input} result={result} onClear={clearAll} />
      </div>
    </div>
  );
}
```

Merge de localStorage: garantir shape mínimo (se JSON antigo/parcial, merge com defaults). Não quebrar se `additionalCosts` ausente.

- [ ] **Step 2: Manual smoke in browser** (`npm run dev`) — mudar quantidade e ver resumo atualizar; reload mantém valores; Limpar reseta.

- [ ] **Step 3: Commit**

```bash
git add components/pricing-calculator/
git commit -m "feat: wire pricing calculator state, preset, and localStorage"
```

---

### Task 8: Page RSC + SEO educational content

**Files:**
- Create: `app/ferramentas/calculadora-impressao-3d/page.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `PricingCalculator`, `Section`, `siteConfig`
- Produces: rota indexável

- [ ] **Step 1: Create page**

Metadata (title absolute ou template):

```ts
export const metadata: Metadata = {
  title: {
    absolute:
      "Calculadora de Preço de Impressão 3D | Quanto cobrar por uma impressão 3D",
  },
  description:
    "Calcule quanto cobrar pelas suas impressões 3D considerando filamento, energia, tempo da impressora, mão de obra, impostos, perdas e margem de lucro.",
  alternates: { canonical: "/ferramentas/calculadora-impressao-3d" },
  openGraph: {
    title:
      "Calculadora de Preço de Impressão 3D | Quanto cobrar por uma impressão 3D",
    description:
      "Calcule quanto cobrar pelas suas impressões 3D considerando filamento, energia, tempo da impressora, mão de obra, impostos, perdas e margem de lucro.",
    url: "/ferramentas/calculadora-impressao-3d",
  },
};
```

Header copy do brief + nota “Você não precisa preencher todos os campos…”.

Montar `<PricingCalculator />` dentro de `Section` / `container`.

Abaixo, bloco educativo (`prose-narrow`) com H2s:

1. Como calcular o preço de uma impressão 3D?
2. Filamento não é o único custo
3. Qual margem usar em impressão 3D?

Tom do canal; sem afirmar margem “certa”.

- [ ] **Step 2: Add sitemap entry**

```ts
{
  url: `${siteConfig.url}/ferramentas/calculadora-impressao-3d`,
  lastModified,
  changeFrequency: "monthly",
  priority: 0.9,
},
```

- [ ] **Step 3: Commit**

```bash
git add app/ferramentas/calculadora-impressao-3d/page.tsx app/sitemap.ts
git commit -m "feat: add 3D pricing calculator page with SEO content"
```

---

### Task 9: Hub + home integration

**Files:**
- Modify: `app/ferramentas/page.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update `/ferramentas`**

- Card com `href="/ferramentas/calculadora-impressao-3d"`, tag `gratuita`
- Título/descrição alinhados; remover “Ainda não está pronta”
- Atualizar metadata description (sem “Em breve”)

- [ ] **Step 2: Update home card Ferramentas**

- Trocar tag `em breve` por algo como `no ar` ou `gratuita`
- Texto: calculadora de preço de impressão 3D disponível; CTA implícito via `href="/ferramentas"` ou link direto para a calculadora (preferir `href="/ferramentas/calculadora-impressao-3d"` no card de ferramentas **ou** manter `/ferramentas` e mencionar a calculadora — escolha: link direto na home para a ferramenta, mais útil no vídeo)

Recomendação do plano: home card Ferramentas → `/ferramentas`; card interno em `/ferramentas` → calculadora. Na home, atualizar copy: “A primeira ferramenta — calculadora de preço de impressão 3D — já está no ar.”

- [ ] **Step 3: Commit**

```bash
git add app/ferramentas/page.tsx app/page.tsx
git commit -m "feat: link pricing calculator from ferramentas and home"
```

---

### Task 10: Final verification

**Files:** possibly small fixes only

- [ ] **Step 1: Re-run benchmark**

```bash
npx --yes tsx scripts/verify-pricing.ts
```

Expected: `verify-pricing: OK`

- [ ] **Step 2: Lint + build**

```bash
npm run lint
npm run build
```

Expected: exit 0, sem erros TS

- [ ] **Step 3: Manual checklist (dev server)**

- [ ] Desktop: sticky summary ao rolar
- [ ] Mobile: formulário → resultado
- [ ] Avançado começa fechado
- [ ] Preset iniciante aplica 10% / 1,50 / 40%
- [ ] Margem 60% + taxas 50% → erro
- [ ] Copiar resumo cola texto BRL
- [ ] Limpar zera e remove storage
- [ ] Preencher benchmark manualmente → ~R$ 8,57/un

- [ ] **Step 4: Commit fixes if any**

```bash
git add -A
git commit -m "fix: polish pricing calculator after verification"
```

(Skip empty commit if clean.)

---

## Self-review (plan vs spec)

| Spec item | Task |
|-----------|------|
| Rota + SEO + educativo | 8 |
| Fórmulas + margem correta + validação | 2 |
| Arredondamento D | 2 |
| Layout 2 colunas + sticky | 6–7 |
| Progressive disclosure A | 4–5 |
| Preset iniciante | 7 |
| localStorage + Limpar | 7 |
| Custos adicionais dinâmicos | 5 |
| Breakdown + barras CSS | 6 |
| Copiar resumo | 6 |
| Hub/home | 9 |
| Sitemap | 8 |
| Sem test runner novo | 2 (tsx one-off) |
| Benchmark | 2, 10 |
| A11y Field/tooltip | 3 |

Sem placeholders remanescentes; nomes de tipos alinhados entre tasks.
