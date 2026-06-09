import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { ContactSheet } from "@/components/site/ContactSheet";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Commission a piece, reserve a Paint N Sip seat, or just say hello — replies usually land the same day.",
};

/**
 * /contact — single-column page with the email shown plainly, the
 * ContactSheet as the primary CTA, and a brief invitation. No clever
 * effects; this page exists to be useful.
 */
export default function ContactPage() {
  return (
    <main className="bg-shell pt-[var(--nav-h)]">
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink/55">
          <span className="text-ink/35">&mdash;</span> Contact
        </p>

        <h1 className="mt-6 max-w-[18ch] font-display text-5xl leading-[1.05] tracking-[-0.02em] text-ink md:text-7xl">
          Say hello.
        </h1>

        <p className="mt-8 max-w-[55ch] text-base leading-[1.7] text-ink/75 md:text-lg">
          Commission a piece. Reserve a Paint N Sip seat. Or just say hello
          &mdash; replies usually land the same day.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">
              Email
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-block font-display text-xl text-ink underline-offset-4 hover:text-rust hover:underline md:text-2xl"
            >
              {site.email}
            </a>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">
              Send a note
            </p>
            <div className="mt-3">
              <ContactSheet
                defaultSubject="Hello from the gallery site"
                trigger={
                  <Button size="lg">Open the contact form</Button>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
