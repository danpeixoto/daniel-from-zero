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
