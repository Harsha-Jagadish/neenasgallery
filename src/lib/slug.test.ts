import { describe, it, expect } from "vitest";
import { slugify, slugToFile } from "./slug";

describe("slugify", () => {
  it("strips .jpg from page-keyed filenames", () => {
    expect(slugify("p02-01.jpg")).toBe("p02-01");
  });

  it("strips .jpg from kebab-case filenames", () => {
    expect(slugify("mountain-stream-01.jpg")).toBe("mountain-stream-01");
  });

  it("strips uppercase .JPG extensions", () => {
    expect(slugify("rose-on-newsprint.JPG")).toBe("rose-on-newsprint");
  });

  it("strips .jpeg extension", () => {
    expect(slugify("wave-at-dusk.jpeg")).toBe("wave-at-dusk");
  });

  it("handles a filename with no extension gracefully", () => {
    expect(slugify("no-extension")).toBe("no-extension");
  });

  it("strips only the final extension (last dot segment)", () => {
    expect(slugify("some.file.jpg")).toBe("some.file");
  });
});

describe("slugToFile", () => {
  it("appends .jpg to re-derive the filename", () => {
    expect(slugToFile("p02-01")).toBe("p02-01.jpg");
  });

  it("works for kebab-case slugs", () => {
    expect(slugToFile("mountain-stream-01")).toBe("mountain-stream-01.jpg");
  });
});

// SF-14: roundtrip property — slugify(slugToFile(slug)) must equal slug
// for all slugs that slugToFile produces (i.e. no extension in the slug).
describe("slugify/slugToFile roundtrip", () => {
  const slugs = ["p02-01", "mountain-stream-01", "some.file"];

  for (const slug of slugs) {
    it(`slugify(slugToFile("${slug}")) === "${slug}"`, () => {
      expect(slugify(slugToFile(slug))).toBe(slug);
    });
  }
});
