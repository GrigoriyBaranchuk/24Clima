import type { Metadata } from "next";

// Internal admin tools (articles editor + SEO panel). Never index or follow.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
