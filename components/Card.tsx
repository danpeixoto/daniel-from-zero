import type { ReactNode } from "react";
import Link from "next/link";

type CardProps = {
  children: ReactNode;
  className?: string;
  tag?: string;
  href?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Card({ children, className, tag, href }: CardProps) {
  const classes = cx(
    "block h-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:p-6 transition duration-200",
    href &&
      "hover:-translate-y-0.5 hover:border-[var(--color-accent)] focus-visible:border-[var(--color-accent)]",
    className,
  );

  const content = (
    <>
      {tag ? (
        <span className="mb-3 inline-flex rounded-[var(--radius-pill)] border border-[var(--color-border)] px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.6875rem] text-[var(--color-ink-muted)]">
          {tag}
        </span>
      ) : null}
      {children}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
