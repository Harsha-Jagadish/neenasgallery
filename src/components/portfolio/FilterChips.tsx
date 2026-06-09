"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Medium } from "@/content/works";

interface FilterChipsProps {
  mediums: readonly Medium[];
  categories: readonly string[];
  activeMedium?: string;
  activeCategory?: string;
}

/**
 * Chip row for filtering the portfolio by medium and category.
 * State is stored in URL search params so the server component
 * re-renders with the filtered works on each navigation.
 */
export function FilterChips({
  mediums,
  categories,
  activeMedium,
  activeCategory,
}: FilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // SF-12: separate callbacks — each only mutates its own key.
  const toggleMedium = useCallback(
    (m: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (m === activeMedium) {
        params.delete("medium");
      } else {
        params.set("medium", m);
      }
      const qs = params.toString();
      router.push(qs ? `/portfolio?${qs}` : "/portfolio", { scroll: false });
    },
    [router, searchParams, activeMedium]
  );

  const toggleCategory = useCallback(
    (c: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (c === activeCategory) {
        params.delete("category");
      } else {
        params.set("category", c);
      }
      const qs = params.toString();
      router.push(qs ? `/portfolio?${qs}` : "/portfolio", { scroll: false });
    },
    [router, searchParams, activeCategory]
  );

  const clearAll = () => {
    router.push("/portfolio", { scroll: false });
  };

  const isAll = !activeMedium && !activeCategory;

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex items-center px-3 py-1.5 text-xs uppercase tracking-[0.15em] border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
      active
        ? "bg-mint border-mint text-ink"
        : "bg-transparent border-mist text-ink/60 hover:border-ink/40 hover:text-ink"
    );

  return (
    <div
      role="group"
      aria-label="Filter paintings"
      className="flex flex-wrap gap-2"
    >
      <button
        type="button"
        onClick={clearAll}
        className={chipClass(isAll)}
        aria-pressed={isAll}
      >
        All
      </button>

      {mediums.length > 0 && (
        <>
          <span
            className="self-center text-xs text-ink/30 select-none"
            aria-hidden="true"
          >
            |
          </span>
          {mediums.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMedium(m)}
              className={chipClass(activeMedium === m)}
              aria-pressed={activeMedium === m}
            >
              {m}
            </button>
          ))}
        </>
      )}

      {categories.length > 0 && (
        <>
          <span
            className="self-center text-xs text-ink/30 select-none"
            aria-hidden="true"
          >
            |
          </span>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              className={chipClass(activeCategory === c)}
              aria-pressed={activeCategory === c}
            >
              {c}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
