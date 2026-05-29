// Node 25+ ships a stubbed `globalThis.localStorage = {}` (an empty object
// without `getItem`/`setItem`). Libraries that probe for browser environment
// via `typeof globalThis.localStorage === "object"` then crash when they call
// the missing methods (Supabase auth-js, Next's dev error overlay, etc.).
// Strip the stub before any module loads.
if (typeof globalThis !== "undefined") {
  const ls = (globalThis as unknown as { localStorage?: unknown }).localStorage;
  if (
    ls &&
    typeof ls === "object" &&
    typeof (ls as { getItem?: unknown }).getItem !== "function"
  ) {
    delete (globalThis as { localStorage?: unknown }).localStorage;
  }
}

export async function register() {
  // This function runs at build time and can help with module registration
  // next-intl config is automatically loaded from src/i18n/request.ts
}
