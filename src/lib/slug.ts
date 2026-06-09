/**
 * Strips the file extension to produce the URL slug for a painting.
 *
 * Examples:
 *   "p02-01.jpg"             → "p02-01"
 *   "mountain-stream-01.jpg" → "mountain-stream-01"
 *   "rose-on-newsprint.JPG"  → "rose-on-newsprint"
 *   "some.file.jpg"          → "some.file"  (only the last extension is stripped)
 */
export function slugify(file: string): string {
  return file.replace(/\.[^.]+$/, "");
}

/**
 * Finds the filename from a slug. Appends ".jpg" as the canonical extension.
 * Used when resolving a URL slug back to a public/art/ path.
 *
 * Note: always appends lowercase ".jpg" — slugs produced from uppercase ".JPG"
 * files are not roundtrippable through this function.
 */
export function slugToFile(slug: string): string {
  return `${slug}.jpg`;
}
