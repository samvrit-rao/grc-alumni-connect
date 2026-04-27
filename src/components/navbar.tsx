"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z" />
      </svg>
    ),
  },
  {
    href: "/alumni",
    label: "My Network",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z" />
      </svg>
    ),
  },
  {
    href: "/messaging",
    label: "Messaging",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.5A1.5 1.5 0 119.5 11 1.5 1.5 0 018 12.5zm4 0a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5zm4 0a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5z" />
      </svg>
    ),
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-li-border sticky top-0 z-50">
      <div className="mx-auto max-w-[1128px] px-4">
        <div className="flex h-[52px] items-center justify-between">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <svg className="h-[34px] w-[34px] text-li-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </Link>
            <div className="hidden sm:block relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-li-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search alumni..."
                className="w-[280px] h-[34px] pl-9 pr-3 bg-[#EEF3F8] rounded text-sm text-li-text placeholder:text-li-text-muted focus:outline-none focus:ring-1 focus:ring-li-blue"
              />
            </div>
          </div>

          {/* Center: Nav icons */}
          <div className="flex items-center gap-0">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-[80px] h-[52px] text-[11px] transition-colors border-b-2 ${
                    isActive
                      ? "text-li-text border-li-text"
                      : "text-li-text-secondary border-transparent hover:text-li-text"
                  }`}
                >
                  {item.icon}
                  <span className="mt-0.5 hidden sm:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Beta badge + avatar */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-li-blue/10 text-li-blue px-2 py-0.5 rounded-full font-semibold">
              BETA
            </span>
            <div className="h-7 w-7 rounded-full bg-li-blue flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">GRC</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
