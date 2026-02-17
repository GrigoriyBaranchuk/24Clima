/** Normalizes slug for URL and DB: trim slashes/spaces, lowercase, spaces → hyphens */
export function normalizeSlug(input: string): string {
  return input
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
