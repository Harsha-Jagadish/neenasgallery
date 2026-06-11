import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { site } from "@/content/site";
import { featuredWorks } from "@/content/works";

// Fraunces is a variable serif with axes for weight, optical size, SOFT
// (corner softness), and WONK (alt character shapes). Loading variable so
// CSS scroll-driven animations can morph `font-variation-settings` smoothly.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const heroPainting = featuredWorks[0];
const description =
  "Original paintings, drawings, and Paint N Sip evenings from Neena Kang — a working studio making landscapes, florals, and portraits intended to evoke emotion.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://neenasgallery.com"
  ),
  title: {
    default: `${site.name} — Original paintings & Paint N Sip events`,
    template: `%s — Neena Kang`,
  },
  description,
  openGraph: {
    title: `${site.name} — Original paintings & Paint N Sip events`,
    description,
    type: "website",
    images: heroPainting
      ? [
          {
            url: `/art/${heroPainting.file}`,
            width: 1200,
            height: 800,
            alt: heroPainting.title ?? "Painting by Neena Kang",
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Original paintings & Paint N Sip events`,
    description,
    images: heroPainting ? [`/art/${heroPainting.file}`] : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
