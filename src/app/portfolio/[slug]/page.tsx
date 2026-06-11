import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { works } from "@/content/works";
import { slugify } from "@/lib/slug";
import { Detail } from "@/components/portfolio/Detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return works.map((w) => ({ slug: slugify(w.file) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = works.find((w) => slugify(w.file) === slug);
  if (!work) return {};

  const title = work.title ?? "Untitled";
  const description = work.description
    ? work.description
    : `${title}${work.medium ? ` — ${work.medium}` : ""}${work.year ? `, ${work.year}` : ""} by Neena Kang.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `/art/${work.file}`, alt: title }],
    },
  };
}

export default async function PaintingDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  const work = works.find((w) => slugify(w.file) === slug);

  if (!work) {
    notFound();
  }

  return <Detail work={work} />;
}
