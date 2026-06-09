"use client";

import { useEffect, useRef } from "react";

import type { Work } from "@/content/works";
import {
  works as allWorks,
  mediums,
  categories,
} from "@/content/works";

import { FallbackGrid } from "./FallbackGrid";
import { FilterChips } from "./FilterChips";

interface PortfolioPageProps {
  works: readonly Work[];
  activeMedium?: string;
  activeCategory?: string;
}

/**
 * Portfolio page — clean static catalog grid (FallbackGrid).
 *
 * Earlier iterations layered an R3F shader Canvas over this grid for a
 * cursor-driven liquid hover effect, but the per-card <View> tracking
 * fought native scroll (scroll lag, click capture, filter-empty bugs) so
 * the WebGL overlay was removed entirely. The liquid shader still lives
 * on the homepage CatalogIndex marquee — contained where it works.
 *
 * Here: just the static grid + filter chips + scroll-reset on filter
 * change. Reliable, fast, accessible.
 */
export function PortfolioPage({
  works,
  activeMedium,
  activeCategory,
}: PortfolioPageProps) {
  // Reset scroll when filter changes — page height shrinks; without snap
  // to top the user gets left below the new short page.
  const filterKey = `${activeMedium ?? ""}|${activeCategory ?? ""}`;
  const lastFilterRef = useRef(filterKey);
  useEffect(() => {
    if (lastFilterRef.current === filterKey) return;
    lastFilterRef.current = filterKey;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [filterKey]);

  const isFiltered = Boolean(activeMedium || activeCategory);
  const totalCount = allWorks.length;
  const filteredCount = works.length;

  return (
    <main className="bg-shell pt-[var(--nav-h)] pb-24 md:pb-32">
      {/* Header + filter chips */}
      <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-10 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
              The catalog
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              All works.
            </h1>
            <p className="mt-2 text-sm text-ink/55">
              {isFiltered
                ? `${filteredCount} of ${totalCount} painting${totalCount !== 1 ? "s" : ""}`
                : `${totalCount} painting${totalCount !== 1 ? "s" : ""}`}
            </p>
          </div>
          <FilterChips
            mediums={mediums}
            categories={categories}
            activeMedium={activeMedium}
            activeCategory={activeCategory}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <FallbackGrid works={works} />
      </div>
    </main>
  );
}
