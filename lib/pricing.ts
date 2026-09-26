import { formatBRL } from "./format";

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
