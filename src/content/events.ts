/**
 * Catalog of upcoming + past Paint N Sip events and gallery happenings.
 *
 * ============================================================
 * HOW TO ADD A NEW EVENT
 * ============================================================
 *
 * Drop a new entry into the `events` array below. Only `slug`, `title`,
 * `date`, `venue` and `description` are strictly required. Everything else
 * (price, capacity, RSVP url, image, etc.) is optional and will be
 * progressively disclosed in the UI when present.
 *
 * Dates are ISO strings ("YYYY-MM-DD") so they sort and compare lexically
 * and avoid all timezone foot-guns.
 *
 * The `upcomingEvents()` helper filters out anything before today, so old
 * events can stay in the file as an archive.
 *
 * ============================================================
 *
 * Phase 2 ships with an EMPTY array on purpose — the homepage's
 * `<EventsTeaser />` falls back to a "coming soon, sign up to hear first"
 * card when the helper returns nothing. Phase 4 will populate this file
 * with the real schedule.
 */

export interface EventVenue {
  name: string;
  city: string;
  address?: string;
}

export interface Event {
  /** URL slug — used for `/events/[slug]` in Phase 4. */
  slug: string;
  title: string;
  /** ISO date "YYYY-MM-DD" — local date of the event. */
  date: string;
  /** Local time string, e.g. "7:00 PM". Optional. */
  time?: string;
  venue: EventVenue;
  /** 1-3 sentence pitch. Plain prose, no markdown. */
  description: string;
  /** Optional hero image — path under /public, e.g. "/art/p02-01.jpg". */
  image?: string;
  /** Display string, e.g. "$65 per seat". Optional. */
  price?: string;
  capacity?: number;
  spotsRemaining?: number;
  /** External RSVP / ticketing URL. Optional. */
  rsvpUrl?: string;
}

/**
 * Live events. The Eventbrite URLs are stable — Eventbrite keys on the
 * numeric event ID at the end of the slug, so renaming the event on
 * Eventbrite won't break this link (Eventbrite redirects old slugs to
 * the current canonical URL).
 *
 * To add a new event:
 *   1. Publish it on Eventbrite, copy the share URL.
 *   2. Drop the banner JPG into /public/events/.
 *   3. Append a new object below with slug + title + date + venue + image
 *      + price + rsvpUrl.
 */
export const events: readonly Event[] = [
  {
    slug: "paint-and-sip-with-artist-neena-2026-07-03",
    title: "Paint and Sip with Artist Neena",
    date: "2026-07-03",
    time: "6:00 PM – 8:30 PM",
    venue: { name: "Menehune Grille", city: "Kahuku, Oahu" },
    description:
      "An evening of creativity, connection & island magic. Acrylic on canvas with full guidance — all supplies included. Bring a friend, a glass of something, and leave with a finished piece.",
    image: "/events/paint-and-sip-banner.jpg",
    rsvpUrl:
      "https://www.eventbrite.com/e/paint-and-sip-tickets-1991432794095?aff=oddtdtcreator",
  },
];

/** Today-or-later events, sorted ascending by date. */
export const upcomingEvents = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return events
    .filter((e) => new Date(e.date) >= todayStart)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
};
