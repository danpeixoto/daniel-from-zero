"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/ferramentas", label: "Ferramentas" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] backdrop-blur-md"
          : "border-transparent bg-[var(--color-bg)]"
      }`}
    >
      <nav
        className="container flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4"
        aria-label="Principal"
      >
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 focus-visible:rounded-[var(--radius-btn)] sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt={`${siteConfig.name} — logo`}
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full sm:size-10"
            priority
          />
          <span className="hidden truncate font-[family-name:var(--font-display)] text-[0.875rem] font-semibold sm:inline md:text-[0.9375rem]">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-0.5 sm:gap-2 md:gap-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[var(--radius-btn)] px-2 py-2 font-[family-name:var(--font-mono)] text-[0.75rem] transition-colors sm:px-3 sm:text-[0.8125rem] ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            href={siteConfig.links.youtube}
            variant="primary"
            className="ml-1 !min-h-9 !px-3 !py-2 text-[0.75rem] sm:!min-h-10 sm:!px-4 sm:text-[0.8125rem]"
          >
            <span className="sm:hidden">YouTube</span>
            <span className="hidden sm:inline">Assista no YouTube</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
