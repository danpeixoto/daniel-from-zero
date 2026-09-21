import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Section({
  id,
  children,
  className,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cx("py-12 sm:py-16 md:py-24", className)}>
      <div className="container">{children}</div>
    </Tag>
  );
}
