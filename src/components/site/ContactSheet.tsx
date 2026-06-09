"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface ContactSheetProps {
  /** The element that opens the sheet (typically a <Button>). */
  trigger: React.ReactNode;
  /** Prefills the subject line — e.g. a painting title or "Paint N Sip". */
  defaultSubject?: string;
  /** Prefills the message body. */
  defaultMessage?: string;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const LABEL_CLASS = "text-xs tracking-[0.2em] uppercase text-ink/60";
const INPUT_CLASS =
  "border-0 border-b border-mist focus:border-ink bg-transparent py-3 outline-none w-full text-ink placeholder:text-ink/40";

export function ContactSheet({
  trigger,
  defaultSubject,
  defaultMessage,
}: ContactSheetProps) {
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const autoCloseTimer = React.useRef<number | null>(null);
  React.useEffect(() => {
    return () => {
      if (autoCloseTimer.current !== null) {
        window.clearTimeout(autoCloseTimer.current);
      }
    };
  }, []);
  const [values, setValues] = React.useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject ?? "",
    message: defaultMessage ?? "",
    date: "",
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  // After a successful submit, reset state once the sheet has closed so the
  // next open starts clean. Scheduled inside onOpenChange (not an effect) to
  // sidestep the react-hooks/set-state-in-effect rule.
  const scheduleReset = React.useCallback(() => {
    window.setTimeout(() => {
      setSubmitted(false);
      setValues({
        name: "",
        email: "",
        phone: "",
        subject: defaultSubject ?? "",
        message: defaultMessage ?? "",
        date: "",
      });
      setErrors({});
    }, 300);
  }, [defaultSubject, defaultMessage]);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Please share your name.";
    if (!values.email.trim()) {
      next.email = "An email helps me reply.";
    } else if (!/.+@.+\..+/.test(values.email)) {
      next.email = "That email looks off.";
    }
    if (!values.message.trim()) {
      next.message = "Tell me a little about what you have in mind.";
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    // Phase 2 may wire this to a real endpoint; for now we just confirm receipt.
    setSubmitted(true);
    // Auto-close the sheet after the confirmation has had time to read.
    // onOpenChange handles the post-close state reset via scheduleReset().
    autoCloseTimer.current = window.setTimeout(() => {
      setOpen(false);
      autoCloseTimer.current = null;
    }, 2500);
  };

  const errorEntries = Object.entries(errors).filter(([, msg]) => Boolean(msg));

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && submitted) scheduleReset();
      }}
    >
      {/* Base UI's SheetTrigger forwards its dialog a11y attrs (aria-haspopup,
          aria-expanded, aria-controls) onto the rendered element via the
          `render` prop — cleaner than cloneElement, which dropped them. */}
      {React.isValidElement(trigger) ? (
        <SheetTrigger render={trigger as React.ReactElement} />
      ) : (
        <SheetTrigger>{trigger}</SheetTrigger>
      )}
        <SheetContent
          side="right"
          className="bg-shell text-ink w-full sm:max-w-md md:max-w-lg overflow-y-auto px-6 py-8 sm:px-8"
        >
          <div className="flex flex-col gap-2">
            <SheetTitle className="font-display text-3xl md:text-4xl tracking-[-0.02em] leading-[1] text-ink">
              Get in touch
            </SheetTitle>
            <SheetDescription className="text-base text-ink/70">
              A painting, a commission, a Paint N Sip — write a few lines and
              I&rsquo;ll be back to you soon.
            </SheetDescription>
          </div>

          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-10 border-t border-mist pt-10"
            >
              <p className="font-display text-2xl md:text-3xl tracking-[-0.01em] leading-[1.1] text-ink">
                I&rsquo;ll be in touch soon.
              </p>
              <p className="font-display mt-4 text-lg text-ink/70 italic">
                — Kineena
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 flex flex-col space-y-6"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className={LABEL_CLASS}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-phone" className={LABEL_CLASS}>
                  Phone{" "}
                  <span className="lowercase tracking-normal text-ink/40">
                    (optional)
                  </span>
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-subject" className={LABEL_CLASS}>
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="A painting, a commission, an event…"
                  className={INPUT_CLASS}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className={LABEL_CLASS}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  required
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  className={`${INPUT_CLASS} resize-none`}
                />
                <span className="text-[10px] tracking-[0.15em] uppercase text-ink/40">
                  {values.message.length}/1000
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-date" className={LABEL_CLASS}>
                  Preferred date{" "}
                  <span className="lowercase tracking-normal text-ink/40">
                    (optional)
                  </span>
                </label>
                <input
                  id="contact-date"
                  name="date"
                  type="date"
                  value={values.date}
                  onChange={(e) => update("date", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div aria-live="polite" className="min-h-[1.25rem]">
                {errorEntries.length > 0 && (
                  <ul className="space-y-1 text-sm text-destructive">
                    {errorEntries.map(([field, msg]) => (
                      <li key={field}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full tracking-[0.2em] uppercase"
              >
                Send
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
  );
}
