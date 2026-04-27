"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/alumni", label: "Alumni Directory" },
  { href: "/recruiters", label: "Recruiters" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-navy text-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-columbia-blue flex items-center justify-center">
                <span className="text-navy font-bold text-sm">GRC</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-base font-semibold leading-tight">
                  GRC Alumni Connect
                </div>
                <div className="text-[10px] text-columbia-blue tracking-wider uppercase">
                  Columbia University
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-columbia-blue/20 text-columbia-blue px-2 py-1 rounded-full font-medium uppercase tracking-wider">
              Beta
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
