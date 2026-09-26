import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Callout } from "@/components/blog/Callout";
import { Checklist, ChecklistItem } from "@/components/blog/Checklist";
import { CtaBox } from "@/components/blog/CtaBox";
import { Formula } from "@/components/blog/Formula";
import { slugifyHeading } from "@/lib/blog";

function getTextContent(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return getTextContent(props.children);
  }
  return "";
}

function Heading({
  as: Tag,
  children,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { as: "h2" | "h3" }) {
  const text = getTextContent(children);
  const id = props.id ?? slugifyHeading(text);

  return (
    <Tag id={id} {...props}>
      <a href={`#${id}`} className="heading-anchor">
        {children}
      </a>
    </Tag>
  );
}

function MdxLink({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  a: MdxLink,
  Callout,
  Formula,
  CtaBox,
  Checklist,
  ChecklistItem,
  table: (props) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};
