import type { BlogHeading } from "@/lib/blog";

type PostTocProps = {
  headings: BlogHeading[];
  title?: string;
};

export function PostToc({
  headings,
  title = "Neste artigo",
}: PostTocProps) {
  const items = headings.filter((h) => h.level === 2);
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Sumário"
      className="my-8 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:my-10 sm:p-6"
    >
      <p className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-[var(--color-ink)]">
        {title}
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-[0.875rem] text-[var(--color-ink-muted)] sm:text-[0.9375rem]">
        {items.map((item) => (
          <li key={item.id} className="pl-1">
            <a
              href={`#${item.id}`}
              className="text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
