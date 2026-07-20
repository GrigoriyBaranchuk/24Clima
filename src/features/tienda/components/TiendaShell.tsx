import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

/**
 * Chrome wrapper for every /tienda page. Reuses the marketing site's own
 * Header / Footer / BottomNav (the shop's own layout Header/Footer are NOT ported)
 * so the shop section shares the site's navigation. `pt-20` clears the fixed h-20
 * header; `pb-24 lg:pb-0` clears the mobile BottomNav.
 */
export function TiendaShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-20 pb-24 lg:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
