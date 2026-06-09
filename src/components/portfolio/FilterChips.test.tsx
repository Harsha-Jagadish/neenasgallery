import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Must be hoisted before the import of FilterChips.
const mockPush = vi.fn();
// SF-15: keep a mutable URLSearchParams for test resets; cast through unknown
// when providing to the mock so it satisfies ReadonlyURLSearchParams at the
// type level — URLSearchParams is structurally compatible at runtime.
const rawSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () =>
    rawSearchParams as unknown as import("next/navigation").ReadonlyURLSearchParams,
}));

import { FilterChips } from "./FilterChips";
import type { Medium } from "@/content/works";

const mediums: Medium[] = ["acrylic", "watercolor", "pencil"];
const categories = ["landscape", "florals", "seascape"];

beforeEach(() => {
  mockPush.mockClear();
  // Clear all keys so params added by one test never leak into the next.
  Array.from(rawSearchParams.keys()).forEach((k) => rawSearchParams.delete(k));
});

describe("FilterChips", () => {
  it("renders 'All' chip plus one chip per medium and category", () => {
    render(
      <FilterChips
        mediums={mediums}
        categories={categories}
      />
    );
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    for (const m of mediums) {
      expect(screen.getByRole("button", { name: m })).toBeInTheDocument();
    }
    for (const c of categories) {
      expect(screen.getByRole("button", { name: c })).toBeInTheDocument();
    }
  });

  it("'All' chip has aria-pressed=true when no filter is active", () => {
    render(<FilterChips mediums={mediums} categories={categories} />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("active medium chip has aria-pressed=true", () => {
    render(
      <FilterChips
        mediums={mediums}
        categories={categories}
        activeMedium="acrylic"
      />
    );
    expect(screen.getByRole("button", { name: "acrylic" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "watercolor" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("clicking a medium chip calls router.push with ?medium=acrylic", async () => {
    const user = userEvent.setup();
    render(<FilterChips mediums={mediums} categories={categories} />);
    await user.click(screen.getByRole("button", { name: "acrylic" }));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("medium=acrylic"),
      expect.objectContaining({ scroll: false })
    );
  });

  it("clicking active medium chip clears the filter (toggles off)", async () => {
    const user = userEvent.setup();
    render(
      <FilterChips
        mediums={mediums}
        categories={categories}
        activeMedium="acrylic"
      />
    );
    await user.click(screen.getByRole("button", { name: "acrylic" }));
    // When toggling off the active filter, the URL should not contain medium=acrylic
    const callArg = mockPush.mock.calls[0][0] as string;
    expect(callArg).not.toContain("medium=acrylic");
  });

  it("clicking 'All' navigates to /portfolio with no params", async () => {
    const user = userEvent.setup();
    render(
      <FilterChips
        mediums={mediums}
        categories={categories}
        activeMedium="acrylic"
      />
    );
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(mockPush).toHaveBeenCalledWith(
      "/portfolio",
      expect.objectContaining({ scroll: false })
    );
  });

  it("clicking a category chip calls router.push with ?category=landscape", async () => {
    const user = userEvent.setup();
    render(<FilterChips mediums={mediums} categories={categories} />);
    await user.click(screen.getByRole("button", { name: "landscape" }));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("category=landscape"),
      expect.objectContaining({ scroll: false })
    );
  });
});
