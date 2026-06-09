import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ContactSheet } from "@/components/site/ContactSheet";
import { upcomingEvents } from "@/content/events";
import { featuredWorks } from "@/content/works";

/**
 * Upcoming Paint N Sip + gallery happenings.
 *
 * Per-event Reserve CTA:
 *   - If the event has `rsvpUrl` (Eventbrite or similar), the button is an
 *     external link that opens in a new tab.
 *   - Otherwise, it opens the ContactSheet with the event pre-filled.
 *
 * If no upcoming events exist (events.ts empty), falls back to a
 * "coming soon — sign up" card with a ContactSheet trigger.
 */
export function EventsTeaser() {
  const events = upcomingEvents().slice(0, 3);
  const fallbackImage =
    featuredWorks.find((w) => w.file === "p02-01.jpg")?.file ??
    featuredWorks[0]?.file;

  const formatDate = (iso: string) => {
    // Parse as local noon so timezones west of UTC don't shift the day.
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="bg-shell py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
              <span className="text-ink/35">05 &mdash;</span> Coming up
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              Upcoming Paint N Sip evenings.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/70 md:text-base">
            Bring a friend, a glass of something, and leave with a finished
            canvas. All supplies and guidance included.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="mt-12 grid grid-cols-1 overflow-hidden border border-mist bg-shell md:mt-16 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[24rem]">
              {fallbackImage && (
                <Image
                  src={`/art/${fallbackImage}`}
                  alt="A still life from the studio"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
                Events &middot; Coming soon
              </p>
              <h3 className="font-display text-3xl leading-tight text-ink md:text-4xl">
                The next round is being scheduled.
              </h3>
              <p className="max-w-md text-base leading-relaxed text-ink/75">
                Sign up to be the first to hear about the next Paint N Sip
                &mdash; small groups, local venues, one good evening.
              </p>
              <div>
                <ContactSheet
                  defaultSubject="Notify me about Paint N Sip events"
                  defaultMessage="I'd love to hear when the next Paint N Sip is scheduled."
                  trigger={<Button size="lg">Notify me</Button>}
                />
              </div>
            </div>
          </div>
        ) : (
          <ul className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {events.map((event) => {
              const imageSrc = event.image
                ? event.image
                : fallbackImage
                  ? `/art/${fallbackImage}`
                  : null;
              return (
                <li
                  key={event.slug}
                  className="flex w-[80%] shrink-0 snap-start flex-col border border-mist bg-shell md:w-auto"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-mist/30">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={event.title}
                        fill
                        sizes="(min-width: 768px) 30vw, 80vw"
                        className="object-cover"
                      />
                    )}
                    {/* Eventbrite badge when an external RSVP exists */}
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
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/55">
                      {formatDate(event.date)}
                      {event.time ? ` · ${event.time}` : ""}
                    </p>
                    <h3 className="font-display text-2xl leading-tight text-ink">
                      {event.title}
                    </h3>
                    <p className="text-sm text-ink/70">
                      {event.venue.name}, {event.venue.city}
                    </p>
                    <p className="text-sm leading-relaxed text-ink/75">
                      {event.description}
                    </p>
                    {/* Price + spots row */}
                    <dl className="mt-1 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.28em] text-ink/55">
                      {event.price && (
                        <div className="flex items-center gap-2">
                          <dt className="text-ink/35">Price</dt>
                          <dd className="text-ink/70">{event.price}</dd>
                        </div>
                      )}
                      {event.spotsRemaining != null && (
                        <div className="flex items-center gap-2">
                          <dt className="text-ink/35">Spots</dt>
                          <dd className="text-ink/70">
                            {event.spotsRemaining} left
                          </dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-auto pt-3">
                      {event.rsvpUrl ? (
                        <Button
                          variant="default"
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
                          trigger={
                            <Button variant="outline">Reserve</Button>
                          }
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
