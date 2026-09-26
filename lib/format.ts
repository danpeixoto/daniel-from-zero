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
