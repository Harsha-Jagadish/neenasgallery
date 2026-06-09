import { Reveal } from "@/components/ui/reveal";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ArtistIntro } from "@/components/home/ArtistIntro";
import { CatalogIndex } from "@/components/home/CatalogIndex";
import { ClosingCta } from "@/components/home/ClosingCta";
import { EventsTeaser } from "@/components/home/EventsTeaser";
import { Hero } from "@/components/home/Hero";
import { MediumMarquee } from "@/components/home/MediumMarquee";
import { StudioInterlude } from "@/components/home/StudioInterlude";

/**
 * Homepage composition.
 *
 * Reads as a numbered catalog with one horizontal beat (the marquee) for
 * rhythm — pure vertical scroll reads templated.
 *
 *   01 — Hero (type-first, no bg image)
 *   02 — StudioInterlude (pinned scroll-scrub through 3 paintings)
 *   —    MediumMarquee (horizontal medium ticker)
 *   03 — CatalogIndex (numbered work list + cursor-follow preview)
 *   04 — ArtistIntro (pull-quote, native CSS scroll-driven reveals)
 *   05 — EventsTeaser (Paint N Sip)
 *   06 — ClosingCta (contact, mesh-gradient backdrop)
 *
 * <SmoothScroll> mounts Lenis + ScrollTrigger sync for the homepage.
 * /portfolio has its own internal Lenis (Phase 3).
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main className="flex flex-col">
        <Hero />
        <StudioInterlude />
        <MediumMarquee />
        <CatalogIndex />
        <ArtistIntro />
        <Reveal>
          <EventsTeaser />
        </Reveal>
        <ClosingCta />
      </main>
    </>
  );
}
