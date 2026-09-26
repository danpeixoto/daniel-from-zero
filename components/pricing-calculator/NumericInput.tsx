"use client";

import { useState } from "react";
import {
  formatDecimalInput,
  isAllowedDecimalDraft,
  isAllowedIntegerDraft,
  parseDecimalInput,
  parseIntegerInput,
} from "@/lib/parseNumber";
import { inputClassName } from "./Field";

type CommonProps = {
  id: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type DecimalProps = CommonProps & {
  maxFractionDigits?: number;
};

function clamp(n: number, min?: number, max?: number): number {
  let x = n;
  if (min !== undefined) x = Math.max(min, x);
  if (max !== undefined) x = Math.min(max, x);
  return x;
}

export function DecimalInput({
  id,
  value,
  onChange,
  min = 0,
  max,
  maxFractionDigits = 4,
  className,
  ...a11y
}: DecimalProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display =
    draft !== null ? draft : formatDecimalInput(value, maxFractionDigits);

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      value={display}
      className={className ?? inputClassName}
      {...a11y}
      onFocus={() => setDraft(formatDecimalInput(value, maxFractionDigits))}
      onChange={(e) => {
        const raw = e.target.value;
        if (!isAllowedDecimalDraft(raw)) return;
        setDraft(raw);
        const parsed = parseDecimalInput(raw);
        if (parsed !== null) onChange(clamp(parsed, min, max));
      }}
      onBlur={() => {
        const parsed = parseDecimalInput(draft ?? "");
        const next = clamp(parsed ?? min ?? 0, min, max);
        onChange(next);
        setDraft(null);
      }}
    />
  );
}

export function IntegerInput({
  id,
  value,
  onChange,
  min = 0,
  max,
  className,
  ...a11y
}: CommonProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft !== null ? draft : String(Math.trunc(value));

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      value={display}
      className={className ?? inputClassName}
      {...a11y}
      onFocus={() => setDraft(String(Math.trunc(value)))}
      onChange={(e) => {
        const raw = e.target.value;
        if (!isAllowedIntegerDraft(raw)) return;
        setDraft(raw);
        const parsed = parseIntegerInput(raw);
        if (parsed !== null) onChange(clamp(Math.floor(parsed), min, max));
      }}
      onBlur={() => {
        const parsed = parseIntegerInput(draft ?? "");
        const next = clamp(Math.floor(parsed ?? min ?? 0), min, max);
        onChange(next);
        setDraft(null);
      }}
    />
  );
}
