export function resolveHref(href: string, sourceUrl: URL): URL | null {
  const normalizedHref = href.trim();

  if (
    normalizedHref.length === 0 ||
    normalizedHref.startsWith("#") ||
    normalizedHref.startsWith("javascript:") ||
    normalizedHref.startsWith("mailto:")
  ) {
    return null;
  }

  try {
    if (normalizedHref.startsWith("/")) {
      return new URL(normalizedHref, sourceUrl.origin);
    }

    return new URL(normalizedHref, sourceUrl);
  } catch {
    return null;
  }
}
