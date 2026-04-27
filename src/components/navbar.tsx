"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/alumni", label: "Alumni Directory" },
  { href: "/recruiters", label: "Recruiters" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
            {session && (
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
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      pathname.startsWith("/admin")
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-columbia-blue text-navy text-xs font-semibold">
                        {session.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {session.user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => signIn()}
                className="bg-columbia-blue text-navy hover:bg-columbia-light font-semibold text-sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
