import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/content/works";
import { slugify } from "@/lib/slug";

interface FallbackGridProps {
  works: readonly Work[];
}

/**
 * Static next/image grid — rendered immediately on first paint, and used
 * permanently for reduced-motion / no-WebGL visitors. Matches the visual
 * style of FeaturedWorks: aspect-[4/5], hover scale, Cormorant title,
 * uppercase tracking-widest medium.
 */
export function FallbackGrid({ works }: FallbackGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
      {works.map((w) => {
        const title = w.title ?? "Untitled";
        const slug = slugify(w.file);
        return (
          <li key={w.file}>
            <Link
              href={`/portfolio/${slug}`}
              className="group block focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
            >
              <div
                className="relative aspect-[4/5] overflow-hidden bg-mist/30"
                style={{ viewTransitionName: `painting-${slug}` }}
              >
                <Image
                  src={`/art/${w.file}`}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-3 font-display text-base text-ink md:text-lg">
                {title}
              </h3>
              {w.medium && (
                <p className="mt-1 text-xs uppercase tracking-widest text-ink/55">
                  {w.medium}
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
