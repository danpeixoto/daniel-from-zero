import type { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Callout({ children, className }: CalloutProps) {
  return (
    <aside
      className={cx(
        "my-6 rounded-[var(--radius-card)] border border-[var(--color-border)] border-l-[3px] border-l-[var(--color-accent)] bg-[var(--color-bg-elevated)] px-4 py-4 text-[0.9375rem] text-[var(--color-ink)] sm:my-8 sm:px-5 sm:py-5",
        className,
      )}
      role="note"
    >
      {children}
    </aside>
  );
}
