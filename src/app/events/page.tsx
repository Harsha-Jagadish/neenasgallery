import type { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ContactSheet } from "@/components/site/ContactSheet";
import { upcomingEvents } from "@/content/events";
import { featuredWorks } from "@/content/works";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming Paint N Sip evenings — small groups, local venues, all supplies and guidance included.",
};

const formatDate = (iso: string) => {
  // Parse as local time (append noon) so timezones west of UTC don't
  // shift the displayed calendar day backwards.
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * /events — full listing of upcoming Paint N Sip evenings. Reuses the same
 * card visual language as the homepage EventsTeaser but in a stacked
 * vertical list with more breathing room and full metadata.
 */
export default function EventsPage() {
  const events = upcomingEvents();
  const fallbackImage =
    featuredWorks.find((w) => w.file === "p02-01.jpg")?.file ??
    featuredWorks[0]?.file;

  return (
    <main className="bg-shell pt-[var(--nav-h)]">
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
          <span className="text-ink/35">&mdash;</span> Paint N Sip
        </p>
        <h1 className="mt-6 max-w-[18ch] font-display text-4xl leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
          Upcoming evenings.
        </h1>
        <p className="mt-6 max-w-[55ch] text-base leading-[1.7] text-ink/70 md:text-lg">
          Bring a friend, a glass of something, and leave with a finished
          canvas. All supplies and guidance included. Small groups, local
          venues.
        </p>
      </section>

      {/* Event cards */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10 md:pb-32">
        {events.length === 0 ? (
          <p className="text-base text-ink/65">
            No upcoming evenings scheduled yet &mdash; check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-10 md:gap-12">
            {events.map((event) => {
              const imageSrc = event.image
                ? event.image
                : fallbackImage
                  ? `/art/${fallbackImage}`
                  : null;
              return (
                <li
                  key={event.slug}
                  className="grid grid-cols-1 gap-6 overflow-hidden border border-mist bg-shell md:grid-cols-[40%_60%] md:gap-0"
                >
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[26rem]">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={event.title}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                      />
                    )}
                    {event.rsvpUrl && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-shell/95 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-ink/70 backdrop-blur">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-rust"
                        />
                        Eventbrite
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 p-8 md:p-12">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55">
                      {formatDate(event.date)}
                      {event.time ? ` · ${event.time}` : ""}
                    </p>
                    <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
                      {event.title}
                    </h2>
                    <p className="text-sm text-ink/70">
                      {event.venue.name}, {event.venue.city}
                    </p>
                    <p className="text-base leading-[1.7] text-ink/80">
                      {event.description}
                    </p>
                    <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/55">
                      {event.price && (
                        <div className="flex items-center gap-2">
                          <dt className="text-ink/35">Price</dt>
                          <dd className="text-ink/75">{event.price}</dd>
                        </div>
                      )}
                      {event.spotsRemaining != null && (
                        <div className="flex items-center gap-2">
                          <dt className="text-ink/35">Spots</dt>
                          <dd className="text-ink/75">
                            {event.spotsRemaining} left
                          </dd>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center gap-2">
                          <dt className="text-ink/35">Capacity</dt>
                          <dd className="text-ink/75">{event.capacity}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-auto pt-4">
                      {event.rsvpUrl ? (
                        <Button
                          size="lg"
                          render={
                            <a
                              href={event.rsvpUrl}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                        >
                          Reserve on Eventbrite ↗
                        </Button>
                      ) : (
                        <ContactSheet
                          defaultSubject={`Reserve a seat — ${event.title}`}
                          defaultMessage={`I'd like to reserve a seat for "${event.title}" on ${formatDate(event.date)}.`}
                          trigger={<Button size="lg">Reserve</Button>}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
