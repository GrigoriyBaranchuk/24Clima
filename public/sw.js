/* eslint-disable no-restricted-globals */
/**
 * 24clima Service Worker — instant repeat-visit loads on mobile.
 *
 * Strategies:
 *   - HTML pages          → stale-while-revalidate
 *     (instant from cache, fresh in background — user never sees a stale
 *     page longer than one visit)
 *   - /_next/static/*     → cache-first, immutable
 *     (Next.js fingerprints filenames, so they never change)
 *   - /_next/image, /uploads, /images → cache-first, 30 days
 *   - Cross-origin (gtag, fbq, supabase) → bypass — let the network handle it
 *
 * Update flow: bump CACHE_VERSION, the new SW activates immediately and
 * old caches are pruned. Open tabs receive the updated SW on their next
 * navigation.
 */

const CACHE_VERSION = "v1-2026-04-29";
const HTML_CACHE = `24c-html-${CACHE_VERSION}`;
const STATIC_CACHE = `24c-static-${CACHE_VERSION}`;
const IMG_CACHE = `24c-img-${CACHE_VERSION}`;
const RUNTIME_CACHES = [HTML_CACHE, STATIC_CACHE, IMG_CACHE];
const IMG_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

self.addEventListener("install", (event) => {
  // Take over as soon as the new SW is installed (no waiting for tab close).
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("24c-") && !RUNTIME_CACHES.includes(k))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isHTMLRequest(request) {
  if (request.method !== "GET") return false;
  if (request.mode === "navigate") return true;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.svg" ||
    url.pathname === "/favicon.ico"
  );
}

function isImage(url) {
  return (
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/uploads/") ||
    url.pathname.startsWith("/images/") ||
    /\.(?:png|jpg|jpeg|webp|avif|svg|gif)$/i.test(url.pathname)
  );
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((res) => {
      if (res && res.status === 200) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  return cached || (await networkPromise) || Response.error();
}

async function cacheFirst(request, cacheName, maxAgeMs) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    if (!maxAgeMs) return cached;
    const dateHeader = cached.headers.get("date");
    if (dateHeader && Date.now() - new Date(dateHeader).getTime() < maxAgeMs) {
      return cached;
    }
  }
  try {
    const res = await fetch(request);
    if (res && res.status === 200) cache.put(request, res.clone());
    return res;
  } catch {
    return cached || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Bypass cross-origin (analytics, supabase, third-party).
  if (url.origin !== self.location.origin) return;

  // Bypass Next.js dev/HMR, RSC payloads, and any non-cacheable internals.
  if (
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/data/") ||
    url.search.includes("_rsc=")
  ) {
    return;
  }

  if (isHTMLRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, HTML_CACHE));
    return;
  }
  if (isStaticAsset(url)) {
    // Next.js fingerprints filenames → safe to cache forever.
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
  if (isImage(url)) {
    event.respondWith(cacheFirst(request, IMG_CACHE, IMG_MAX_AGE_MS));
    return;
  }
  // Default: network-only
});

// Allow the page to ask the SW to skip-waiting (used after deploy notif).
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
