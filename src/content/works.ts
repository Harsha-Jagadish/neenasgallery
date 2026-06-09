/**
 * Catalog of artworks. One entry per piece displayed on the site.
 *
 * ============================================================
 * HOW TO ADD A NEW PAINTING (the easy way)
 * ============================================================
 *
 * 1. Drop the JPEG into `public/art/`. Use a kebab-case filename
 *    that will become the URL slug (e.g. `mountain-stream-01.jpg`).
 *    Recommended: ≤1600px wide, JPEG, ≤500KB.
 *
 * 2. Add one entry to the `works` array below.
 *    Only `file` is strictly required. Everything else is optional.
 *
 *    {
 *      file: "mountain-stream-01.jpg",   // matches /public/art/<file>
 *      title: "Mountain Stream",          // optional, defaults to "Untitled"
 *      year: 2024,                         // optional
 *      medium: "acrylic",                  // optional, see Medium type
 *      orientation: "landscape",           // optional, auto-inferred from image dims
 *      category: "landscape",              // optional grouping label
 *      featured: true,                     // optional, surfaces on the homepage
 *      description: "..."                  // optional 1-2 sentence note
 *    }
 *
 * 3. Done. The portfolio page picks it up automatically.
 *
 * ============================================================
 */

export type Medium =
  | "acrylic"
  | "watercolor"
  | "pencil"
  | "charcoal"
  | "ink"
  | "mixed-media"
  | "calligraphy";

export type Orientation = "portrait" | "landscape" | "square";

export interface Work {
  file: string;
  title?: string;
  year?: number;
  medium?: Medium;
  orientation?: Orientation;
  category?: string;
  featured?: boolean;
  description?: string;
}

export const works: readonly Work[] = [
  // === Page 1 (excluding logo banner) ===
  { file: "p01-02.jpg", title: "Mountain Stream", medium: "acrylic", orientation: "landscape", category: "landscape", featured: true },
  { file: "p01-03.jpg", title: "Orca and Kayak", medium: "acrylic", orientation: "portrait", category: "wildlife" },

  // === Page 2 ===
  { file: "p02-01.jpg", title: "Rose on Newsprint", medium: "mixed-media", orientation: "square", category: "florals", featured: true },
  { file: "p02-02.jpg", title: "Mountain Meadow", medium: "acrylic", orientation: "portrait", category: "landscape" },
  { file: "p02-03.jpg", title: "Rose, in Ink", medium: "ink", orientation: "portrait", category: "florals" },

  // === Page 3 ===
  { file: "p03-01.jpg", title: "Watercolor Coast", medium: "watercolor", orientation: "landscape", category: "seascape" },
  { file: "p03-02.jpg", title: "Snow Range", medium: "acrylic", orientation: "landscape", category: "landscape" },
  { file: "p03-03.jpg", title: "Falls and Birds", medium: "acrylic", orientation: "landscape", category: "landscape" },

  // === Page 4 ===
  { file: "p04-01.jpg", title: "Haystack Rock", medium: "acrylic", orientation: "landscape", category: "seascape" },
  { file: "p04-02.jpg", title: "Quiet Sea", medium: "watercolor", orientation: "landscape", category: "seascape" },
  { file: "p04-03.jpg", title: "Sunset Pier", medium: "acrylic", orientation: "landscape", category: "seascape", featured: true },

  // === Page 5 ===
  { file: "p05-01.jpg", title: "Pastel Shore", medium: "watercolor", orientation: "landscape", category: "seascape" },
  { file: "p05-02.jpg", title: "Wave at Dusk", medium: "acrylic", orientation: "portrait", category: "seascape" },
  { file: "p05-03.jpg", title: "Moonlit Silhouette", medium: "acrylic", orientation: "portrait", category: "still-life" },

  // === Page 6 ===
  { file: "p06-01.jpg", title: "Rose Study", medium: "pencil", orientation: "portrait", category: "florals" },
  { file: "p06-02.jpg", title: "Portrait with Flowers", medium: "pencil", orientation: "portrait", category: "portrait" },
  { file: "p06-03.jpg", title: "Rose on Slate", medium: "pencil", orientation: "portrait", category: "florals" },

  // === Page 7 ===
  { file: "p07-01.jpg", title: "Untitled, p7 #1", category: "landscape" },
  { file: "p07-02.jpg", title: "Untitled, p7 #2" },
  { file: "p07-03.jpg", title: "Untitled, p7 #3" },

  // === Page 8 ===
  { file: "p08-01.jpg", title: "Pink Tulips", medium: "acrylic", orientation: "portrait", category: "florals" },
  { file: "p08-02.jpg", title: "Portrait on Text", medium: "mixed-media", orientation: "portrait", category: "portrait" },
  { file: "p08-03.jpg", title: "World in Clouds", medium: "acrylic", orientation: "portrait", category: "still-life" },

  // === Page 9 ===
  { file: "p09-01.jpg", title: "Untitled, p9 #1" },
  { file: "p09-02.jpg", title: "Untitled, p9 #2" },
  { file: "p09-03.jpg", title: "Untitled, p9 #3" },

  // === Page 10 ===
  { file: "p10-01.jpg", title: "Ocean in Her Hair", medium: "watercolor", orientation: "portrait", category: "portrait", featured: true },
  { file: "p10-02.jpg", title: "Study on Lab Notes", medium: "pencil", orientation: "portrait", category: "portrait" },
  { file: "p10-03.jpg", title: "Lavender Bay", medium: "acrylic", orientation: "landscape", category: "seascape" },

  // === Page 11 ===
  { file: "p11-01.jpg", title: "no rain, no flowers", medium: "calligraphy", orientation: "landscape", category: "lettering" },
  { file: "p11-02.jpg", title: "Untitled, p11 #2" },
  { file: "p11-03.jpg", title: "Untitled, p11 #3" },

  // === Page 12 ===
  { file: "p12-01.jpg", title: "Mountain Reflection I", medium: "acrylic", orientation: "portrait", category: "landscape" },
  { file: "p12-02.jpg", title: "Mountain Reflection II", medium: "acrylic", orientation: "portrait", category: "landscape" },
  { file: "p12-03.jpg", title: "Eye in Smoke", medium: "ink", orientation: "landscape", category: "portrait" },

  // === Page 13 ===
  { file: "p13-01.jpg", title: "Untitled, p13 #1" },
  { file: "p13-02.jpg", title: "Untitled, p13 #2" },
  { file: "p13-03.jpg", title: "Untitled, p13 #3" },

  // === Page 14 — single large piece ===
  { file: "p14-01.jpg", title: "Mountain and Lake", medium: "acrylic", orientation: "portrait", category: "landscape", featured: true },

  // === Page 15 ===
  { file: "p15-01.jpg", title: "Untitled, p15", featured: false },

  // === Page 16 ===
  { file: "p16-01.jpg", title: "Untitled, p16" },

  // === Page 17 — aurora night ===
  { file: "p17-01.jpg", title: "Aurora over the Cabin", medium: "acrylic", orientation: "landscape", category: "landscape", featured: true },

  // === Page 18 ===
  { file: "p18-01.jpg", title: "Untitled, p18" },
] as const;

/** Helpers for views */

export const featuredWorks = works.filter((w) => w.featured);

export const worksByCategory = (cat: string) =>
  works.filter((w) => w.category === cat);

export const worksByMedium = (m: Medium) =>
  works.filter((w) => w.medium === m);

/** All unique mediums + categories present in the catalog — for filter UIs */
export const mediums = Array.from(
  new Set(works.map((w) => w.medium).filter((m): m is Medium => !!m))
).sort();

export const categories = Array.from(
  new Set(works.map((w) => w.category).filter((c): c is string => !!c))
).sort();
