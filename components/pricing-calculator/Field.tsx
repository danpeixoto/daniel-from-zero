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
      <div className="flex items-center gap-1">
        <label
          htmlFor={id}
          className="text-[0.875rem] font-medium text-[var(--color-ink)]"
        >
          {label}
        </label>
        {tooltip ? <HelpTooltip label={label}>{tooltip}</HelpTooltip> : null}
      </div>
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
