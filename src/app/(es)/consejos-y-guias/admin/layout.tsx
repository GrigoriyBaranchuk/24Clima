import type { Metadata } from "next";

// Internal admin tools (articles editor + SEO panel) in the default-locale (es)
// route group. Mirrors [locale]/consejos-y-guias/admin/layout.tsx so the Spanish
// admin URLs are noindexed too — without this, /consejos-y-guias/admin renders
// <meta robots="index, follow"> on prod. Never index or follow.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
