/**
 * Parse pt-BR / en decimal strings.
 * Accepts "0,01", "0.01", "1.234,56", "1234.56".
 * Returns null for empty or incomplete drafts ("", ",", "0,").
 */
export function parseDecimalInput(raw: string): number | null {
  const t = raw.trim();
  if (t === "" || t === "," || t === "." || t === "-") return null;

  let normalized = t;
  if (t.includes(",") && t.includes(".")) {
    // 1.234,56 → 1234.56
    normalized = t.replace(/\./g, "").replace(",", ".");
  } else {
    normalized = t.replace(",", ".");
  }

  // Trailing separator while typing: "0," → incomplete
  if (normalized.endsWith(".")) return null;

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  return n;
}

/** Display number with comma as decimal separator (no thousands grouping). */
export function formatDecimalInput(
  value: number,
  maxFractionDigits = 4,
): string {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("pt-BR", {
    useGrouping: false,
    maximumFractionDigits: maxFractionDigits,
  });
}

/** Allow empty, digits, one comma or dot, optional leading/trailing separator. */
export function isAllowedDecimalDraft(raw: string): boolean {
  return raw === "" || /^\d*[.,]?\d*$/.test(raw);
}

export function isAllowedIntegerDraft(raw: string): boolean {
  return raw === "" || /^\d*$/.test(raw);
}

export function parseIntegerInput(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
