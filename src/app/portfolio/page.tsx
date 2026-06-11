import type { Metadata } from "next";
import { works, mediums, categories } from "@/content/works";
import type { Medium, Work } from "@/content/works";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse all 43 paintings by Neena Kang — acrylics, watercolours, pencil drawings, and mixed media. Landscapes, seascapes, florals, portraits, and more.",
};

interface PageProps {
  searchParams: Promise<{
    medium?: string;
    category?: string;
  }>;
}

export default async function PortfolioRoute({ searchParams }: PageProps) {
  const { medium, category } = await searchParams;

  // Filter server-side so no JS is needed for the fallback grid path.
  let filtered: readonly Work[] = works;

  // Validate against the known-valid sets so unknown query params silently
  // return all works rather than silently returning zero.
  const m = mediums.includes(medium as Medium) ? (medium as Medium) : undefined;
  const c = categories.includes(category as string) ? category : undefined;

  if (m) {
    filtered = filtered.filter((w) => w.medium === m);
  }
  if (c) {
    filtered = filtered.filter((w) => w.category === c);
  }

  return (
    <PortfolioPage
      works={filtered}
      activeMedium={m}
      activeCategory={c}
    />
  );
}
