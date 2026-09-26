import type { ReactNode } from "react";

type ChecklistProps = {
  title?: string;
  children: ReactNode;
};

export function Checklist({ title, children }: ChecklistProps) {
  return (
    <div className="my-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:my-8 sm:p-6">
      {title ? (
        <p className="mb-4 text-[0.9375rem] font-medium text-[var(--color-ink)] sm:text-base">
          {title}
        </p>
      ) : null}
      <ul className="checklist-items m-0 list-none space-y-3 p-0">
        {children}
      </ul>
    </div>
  );
}

type ChecklistItemProps = {
  children: ReactNode;
};

export function ChecklistItem({ children }: ChecklistItemProps) {
  return (
    <li className="flex items-start gap-3 text-[0.9375rem] text-[var(--color-ink-muted)] sm:text-base">
      <span
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-bg)]"
        aria-hidden
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-[var(--color-accent)] opacity-40"
        >
          <path
            d="M2.5 6.5L4.5 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}
