/**
 * Global brand + nav strings. Single source of truth — every component reads
 * from here so renaming or relinking is a one-file change.
 */
export const site = {
  name: "the Kineena Kang Gallery",
  monogram: "KK",
  tagline: "Original paintings & Paint N Sip events.",
  nav: [
    { href: "/portfolio", label: "Work" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  email: "info@tailoredislandexperiences.com",
  social: { instagram: "", linkedin: "" },
} as const;
