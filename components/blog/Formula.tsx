import type { ReactNode } from "react";

type FormulaProps = {
  /** Preferred: string content (MDX children expressions can arrive empty). */
  code?: string;
  children?: ReactNode;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function asText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(asText).join("");
  return "";
}

export function Formula({ code, children, className }: FormulaProps) {
  const text = (code ?? asText(children)).replace(/^\n+|\n+$/g, "");

  return (
    <pre
      className={cx(
        "formula-block my-5 overflow-x-auto rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 font-[family-name:var(--font-mono)] text-[0.875rem] leading-relaxed text-[var(--color-ink)] sm:my-6 sm:px-5 sm:text-[0.9375rem]",
        className,
      )}
    >
      <code>{text}</code>
    </pre>
  );
}
