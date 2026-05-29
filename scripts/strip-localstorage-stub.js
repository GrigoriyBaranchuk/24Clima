// Preloaded via NODE_OPTIONS="--require ./scripts/strip-localstorage-stub.js"
// before any user code runs in each Node process (main + Next workers).
//
// Why: Node 25+ ships a stubbed `globalThis.localStorage = {}` (an empty
// object without `getItem`/`setItem`). Libraries that probe
// `typeof globalThis.localStorage === "object"` then crash when they call
// the missing methods. Affected here: @supabase/auth-js (its locks.js
// short-circuits via `supportsLocalStorage()`, but the dev error overlay
// surfaces other call sites), Next's dev overlay rendering through the
// fallback _document.
//
// Strip the broken stub so libraries fall back to their browserless code path.
if (typeof globalThis !== "undefined") {
  const ls = globalThis.localStorage;
  if (ls && typeof ls === "object" && typeof ls.getItem !== "function") {
    delete globalThis.localStorage;
  }
}
