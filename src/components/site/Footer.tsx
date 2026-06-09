import Link from "next/link";

import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { ContactSheet } from "@/components/site/ContactSheet";

/**
 * Three-column editorial footer. Server component — the only interactive
 * island is the embedded ContactSheet button.
 */
export function Footer() {
  const year = new Date().getFullYear();

  const connect = [
    site.email
      ? { href: `mailto:${site.email}`, label: site.email, external: true }
      : null,
    site.social.instagram
      ? {
          href: site.social.instagram,
          label: "Instagram",
          external: true,
        }
      : null,
    site.social.linkedin
      ? { href: site.social.linkedin, label: "LinkedIn", external: true }
      : null,
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  return (
    <footer className="bg-ink text-shell">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:gap-10 md:px-10 md:py-20">
        <div className="flex flex-col gap-4 md:col-span-1">
          <span className="font-display tracking-[0.16em] uppercase text-sm">
            {site.name}
          </span>
          <p className="max-w-xs text-sm text-shell/70">{site.tagline}</p>
        </div>

        <nav className="flex flex-col gap-3 text-sm" aria-label="Explore">
          <span className="font-display tracking-[0.2em] uppercase text-xs text-shell/60">
            Explore
          </span>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-shell/90 hover:text-shell underline-offset-4 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-3 text-sm" aria-label="Connect">
          <span className="font-display tracking-[0.2em] uppercase text-xs text-shell/60">
            Connect
          </span>
          {connect.length === 0 ? (
            <span className="text-shell/60 italic">
              Links coming soon.
            </span>
          ) : (
            connect.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="text-shell/90 hover:text-shell underline-offset-4 hover:underline"
              >
                {item.label}
              </a>
            ))
          )}
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <span className="font-display tracking-[0.2em] uppercase text-xs text-shell/60">
            Say hello
          </span>
          <p className="max-w-xs text-shell/70">
            A painting caught your eye, or you&rsquo;re thinking about a
            commission? Drop a note.
          </p>
          {/* nav-bar CTA — small (h-8) so it doesn't dominate the chrome */}
          <ContactSheet
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-fit border-shell/40 text-shell hover:bg-shell hover:text-ink"
              >
                Get in touch
              </Button>
            }
          />
        </div>
      </div>

      <div className="border-t border-shell/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-shell/60 md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            &copy; {year} {site.name}
          </p>
          <p className="font-display italic">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
