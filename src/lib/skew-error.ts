// Deployment-skew detection for Next.js error boundaries.
//
// After a production deploy, a browser holding the previous build's HTML/JS
// may request chunks or RSC payloads that no longer exist → ChunkLoadError /
// failed dynamic import → error boundary. A hard reload fetches the fresh
// build and fixes it, so we do that automatically — at most once per TTL to
// avoid reload loops when the failure is not skew-related.

const FLAG_KEY = "24clima-skew-reload-at";
const RELOAD_TTL_MS = 60_000;

const SKEW_PATTERNS = [
  /ChunkLoadError/i,
  /Loading (CSS )?chunk [^ ]+ failed/i,
  /Failed to load chunk/i,
  /CSS_CHUNK_LOAD_FAILED/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /missing required error components/i,
];

export function isSkewError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { name, message } = error as { name?: string; message?: string };
  if (name === "ChunkLoadError") return true;
  const text = `${name ?? ""} ${message ?? ""}`;
  return SKEW_PATTERNS.some((re) => re.test(text));
}

/**
 * Reloads the page once if the error looks like deployment skew.
 * Returns true when a reload was triggered (caller should render nothing).
 */
export function reloadOnceForSkew(error: unknown): boolean {
  if (typeof window === "undefined" || !isSkewError(error)) return false;
  try {
    const last = Number(window.sessionStorage.getItem(FLAG_KEY) ?? 0);
    if (Date.now() - last < RELOAD_TTL_MS) return false;
    window.sessionStorage.setItem(FLAG_KEY, String(Date.now()));
  } catch {
    // sessionStorage unavailable (private mode, blocked) — still try one
    // reload; without the flag we cannot guard loops, so bail instead.
    return false;
  }
  window.location.reload();
  return true;
}
