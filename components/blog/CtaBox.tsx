import { Button } from "@/components/Button";

type CtaBoxProps = {
  title?: string;
  description: string;
  href: string;
  buttonLabel: string;
};

export function CtaBox({
  title,
  description,
  href,
  buttonLabel,
}: CtaBoxProps) {
  return (
    <aside className="my-8 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 sm:my-10 sm:p-6">
      {title ? (
        <h2 className="!mt-0 !text-[1.25rem] font-[family-name:var(--font-display)] font-semibold tracking-[-0.02em] text-[var(--color-ink)] sm:!text-[1.375rem]">
          {title}
        </h2>
      ) : null}
      <p
        className={`text-[0.9375rem] text-[var(--color-ink-muted)] sm:text-base ${title ? "mt-3" : "mt-0"}`}
      >
        {description}
      </p>
      <div className="mt-5 sm:mt-6">
        <Button href={href} variant="outlineAccent">
          {buttonLabel}
        </Button>
      </div>
    </aside>
  );
}
