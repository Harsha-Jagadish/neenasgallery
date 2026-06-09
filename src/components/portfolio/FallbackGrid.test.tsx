import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FallbackGrid } from "./FallbackGrid";
import type { Work } from "@/content/works";

// Minimal works fixture — enough to verify rendering without needing the full catalog.
const fixture: Work[] = [
  { file: "p01-02.jpg", title: "Mountain Stream", medium: "acrylic" },
  { file: "p02-01.jpg", title: "Rose on Newsprint", medium: "mixed-media" },
  { file: "p07-01.jpg", title: "Untitled, p7 #1" },
];

describe("FallbackGrid", () => {
  it("renders a list item for each work", () => {
    render(<FallbackGrid works={fixture} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(fixture.length);
  });

  it("renders links with correct href to /portfolio/[slug]", () => {
    render(<FallbackGrid works={fixture} />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/portfolio/p01-02");
    expect(hrefs).toContain("/portfolio/p02-01");
    expect(hrefs).toContain("/portfolio/p07-01");
  });

  it("uses 'Untitled' as the fallback title when title is absent", () => {
    const noTitle: Work[] = [{ file: "p99-01.jpg" }];
    render(<FallbackGrid works={noTitle} />);
    // The link accessible name includes both the img alt and h3 text.
    // Assert via href instead of accessible name to be robust.
    expect(screen.getByRole("link")).toHaveAttribute("href", "/portfolio/p99-01");
    expect(screen.getByRole("heading", { name: "Untitled" })).toBeInTheDocument();
  });

  it("renders the medium as an uppercase label when present", () => {
    render(<FallbackGrid works={fixture} />);
    const mediumEl = screen.getByText("acrylic");
    expect(mediumEl).toBeInTheDocument();
  });

  it("does not render a medium paragraph when medium is absent", () => {
    const noMedium: Work[] = [{ file: "p07-01.jpg", title: "Untitled, p7 #1" }];
    const { container } = render(<FallbackGrid works={noMedium} />);
    // No <p> element should be in the card when medium is absent.
    const ps = container.querySelectorAll("p");
    expect(ps).toHaveLength(0);
  });

  it("renders correct alt text on every image", () => {
    render(<FallbackGrid works={fixture} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs[0]).toHaveAttribute("alt", "Mountain Stream");
    expect(imgs[1]).toHaveAttribute("alt", "Rose on Newsprint");
    expect(imgs[2]).toHaveAttribute("alt", "Untitled, p7 #1");
  });

  it("renders all 43 works from the real catalog when passed", async () => {
    const { works } = await import("@/content/works");
    render(<FallbackGrid works={works} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(43);
  });
});
