"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Firm } from "@/lib/firms";

interface Props {
  firms: Firm[];
  schools: string[];
  offices: string[];
  practiceAreas: string[];
  currentFilters: Record<string, string | undefined>;
}

export function AlumniFilters({ firms, schools, offices, practiceAreas, currentFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/alumni?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("/alumni");
  }, [router]);

  const hasFilters = Object.values(currentFilters).some(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Free text search */}
        <Input
          placeholder="Search by name, title, or involvement..."
          className="w-full sm:w-72"
          defaultValue={currentFilters.q || ""}
          onChange={(e) => {
            const val = e.target.value;
            // Debounce
            const timeout = setTimeout(() => updateFilter("q", val || undefined), 300);
            return () => clearTimeout(timeout);
          }}
        />

        {/* Firm */}
        <Select
          value={currentFilters.firm || "all"}
          onValueChange={(v) => updateFilter("firm", v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Firms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Firms</SelectItem>
            {firms.map((f) => (
              <SelectItem key={f.slug} value={f.slug}>
                {f.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* School */}
        <Select
          value={currentFilters.school || "all"}
          onValueChange={(v) => updateFilter("school", v)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Schools" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schools</SelectItem>
            {schools.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Office */}
        <Select
          value={currentFilters.office || "all"}
          onValueChange={(v) => updateFilter("office", v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            {offices.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Practice Area */}
        {practiceAreas.length > 0 && (
          <Select
            value={currentFilters.practiceArea || "all"}
            onValueChange={(v) => updateFilter("practiceArea", v)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Practice Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Practice Areas</SelectItem>
              {practiceAreas.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Year range */}
        <Input
          type="number"
          placeholder="From year"
          className="w-28"
          defaultValue={currentFilters.yearFrom || ""}
          onChange={(e) => updateFilter("yearFrom", e.target.value || undefined)}
        />
        <Input
          type="number"
          placeholder="To year"
          className="w-28"
          defaultValue={currentFilters.yearTo || ""}
          onChange={(e) => updateFilter("yearTo", e.target.value || undefined)}
        />

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
