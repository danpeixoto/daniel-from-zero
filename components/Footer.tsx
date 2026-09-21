import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--color-border)] py-8 sm:py-10">
      <div className="container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm text-[var(--color-ink-muted)]">
          © {year} {siteConfig.name}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-3 font-[family-name:var(--font-mono)] text-[0.8125rem] text-[var(--color-ink-muted)]">
          <li>
            <Link
              href="/blog"
              className="inline-block py-1 hover:text-[var(--color-accent)]"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/ferramentas"
              className="inline-block py-1 hover:text-[var(--color-accent)]"
            >
              Ferramentas
            </Link>
          </li>
          <li>
            <a
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1 hover:text-[var(--color-accent)]"
            >
              YouTube
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
