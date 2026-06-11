import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/content/works";
import { Button } from "@/components/ui/button";
import { ContactSheet } from "@/components/site/ContactSheet";
import { slugify } from "@/lib/slug";

interface DetailProps {
  work: Work;
}

/**
 * Detail page layout for a single painting.
 * Server-renderable — ContactSheet is the only client island.
 */
export function Detail({ work }: DetailProps) {
  const title = work.title ?? "Untitled";

  const meta: { label: string; value: string }[] = [];
  if (work.medium) meta.push({ label: "Medium", value: work.medium });
  if (work.year) meta.push({ label: "Year", value: String(work.year) });
  if (work.category) meta.push({ label: "Category", value: work.category });

  // SF-16: aspect derived from orientation — one wrapper, fill Image.
  const aspectClass =
    work.orientation === "landscape" ? "aspect-[5/4]" : "aspect-[4/5]";

  return (
    <main className="bg-shell pt-[var(--nav-h)]">
      {/* Full-width painting. `viewTransitionName` matches the CatalogIndex
          preview / FallbackGrid card for the same slug so browsers that
          support View Transitions morph the source element into this hero. */}
      <div className="flex items-center justify-center bg-cream px-6 py-12 md:px-10">
        <div
          className={`relative w-full max-w-[1100px] mx-auto ${aspectClass} overflow-hidden`}
          style={{ viewTransitionName: `painting-${slugify(work.file)}` }}
        >
          <Image
            src={`/art/${work.file}`}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 90vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* Metadata + CTA */}
      <section className="mx-auto max-w-[800px] px-6 py-16 md:px-10 md:py-24">
        <h1 className="font-display text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {meta.length > 0 && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {meta.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  {label}
                </dt>
                {/* `capitalize` + replace covers "mixed-media" → "Mixed Media".
                    Assumes hyphens are the only word separator in category/medium values. */}
                <dd className="text-sm capitalize text-ink">
                  {value.replace(/-/g, " ")}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {work.description && (
          <p className="mt-8 max-w-[55ch] text-base leading-[1.7] text-ink/80 md:text-lg">
            {work.description}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ContactSheet
            trigger={<Button size="lg">Inquire about this piece</Button>}
            defaultSubject={`Inquiry about *${title}*`}
            defaultMessage={`Hi Neena,\n\nI'm interested in "${title}"${work.medium ? ` (${work.medium})` : ""}. Could you share more details?\n`}
          />
          <Link
            href="/portfolio"
            className="text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          >
            &larr; Back to the gallery
          </Link>
        </div>
      </section>
    </main>
  );
}
