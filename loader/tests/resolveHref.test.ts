import { resolveHref } from "../lib/resolveHref.js";
import { describe, it, expect } from "@jest/globals";

describe("resolveHref", () => {
  const sourceUrl = new URL("https://example.com/docs/guide/index.html");

  it("returns null for empty hrefs", () => {
    expect(resolveHref("   ", sourceUrl)).toBeNull();
  });

  it("returns null for fragment-only hrefs", () => {
    expect(resolveHref("#section-2", sourceUrl)).toBeNull();
  });

  it("returns null for javascript and mailto hrefs", () => {
    expect(resolveHref("javascript:void(0)", sourceUrl)).toBeNull();
    expect(resolveHref("mailto:test@example.com", sourceUrl)).toBeNull();
  });

  it("resolves relative hrefs against the source URL", () => {
    expect(resolveHref("chapter-2", sourceUrl)?.toString()).toBe(
      "https://example.com/docs/guide/chapter-2",
    );
  });

  it("resolves root-relative hrefs against the source origin", () => {
    expect(resolveHref("/about", sourceUrl)?.toString()).toBe(
      "https://example.com/about",
    );
  });

  it("preserves absolute URLs", () => {
    expect(
      resolveHref("https://other.example.org/path?q=1", sourceUrl)?.toString(),
    ).toBe("https://other.example.org/path?q=1");
  });

  it("trims surrounding whitespace before resolving", () => {
    expect(resolveHref("  /contact  ", sourceUrl)?.toString()).toBe(
      "https://example.com/contact",
    );
  });

  it("returns null for malformed hrefs", () => {
    expect(resolveHref("http://[::1", sourceUrl)).toBeNull();
  });
});
