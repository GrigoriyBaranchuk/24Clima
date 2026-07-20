import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import CleaningPackages from "@/components/CleaningPackages";
import Services from "@/components/Services";
import Problems from "@/components/Problems";
import HomeCtaBlocks from "@/components/HomeCtaBlocks";
import BlogPromo from "@/components/BlogPromo";
import StatsSection from "@/components/StatsSection";
import GoogleRatingCard from "@/components/GoogleRatingCard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollReveal from "@/components/ScrollReveal";
import RevealOnDesktop from "@/components/RevealOnDesktop";
import SectionSkeleton from "@/components/SectionSkeleton";
import { isMobileDevice } from "@/lib/device";

export default async function Home() {
  setRequestLocale("es");
  const mobile = await isMobileDevice();

  return (
    <>
      <Header />
      {/*
        MOBILE (< lg): single-screen app-like layout (no scroll).
          Hero → Services 2×2 → Calculator → Google rating plate → BottomNav.
        DESKTOP (≥ lg): full marketing flow — UNCHANGED.
          Hero → Calculator → Services → CleaningPackages → Stats → Problems → CTA → Blog.
      */}
      <main
        id="main-content"
        className="flex flex-col lg:block min-h-[100dvh] lg:min-h-0 lg:h-auto pt-12 pb-[80px] lg:pt-0 lg:pb-0 bg-[#0d1b2a] lg:bg-transparent"
      >
        {/* Hero — both — order 1 */}
        <div className="order-1 shrink-0">
          <Hero />
        </div>

        {/* Services — mobile order 2, desktop order 3 */}
        <div className="order-2 lg:order-3 shrink-0">
          <Suspense fallback={<SectionSkeleton />}>
            <Services />
          </Suspense>
        </div>

        {/* Calculator — mobile order 3, desktop order 2 */}
        <div className="order-3 lg:order-2 shrink-0">
          <RevealOnDesktop>
            <Calculator />
          </RevealOnDesktop>
        </div>

        {/* Google rating plate — MOBILE ONLY, order 4 */}
        <div className="order-4 lg:hidden bg-[#0d1b2a] pt-1.5 pb-2 shrink-0">
          <GoogleRatingCard />
        </div>

        {/* === DESKTOP-ONLY blocks — rendered only on non-mobile UA === */}
        {!mobile && (
          <>
            <div className="hidden lg:block lg:order-5">
              <ScrollReveal>
                <CleaningPackages />
              </ScrollReveal>
            </div>
            <div className="hidden lg:block lg:order-6">
              <ScrollReveal animation="fade-in">
                <StatsSection locale="es" />
              </ScrollReveal>
            </div>
            <div className="hidden lg:block lg:order-7">
              <ScrollReveal>
                <Problems />
              </ScrollReveal>
            </div>
            <div className="hidden lg:block lg:order-8">
              <ScrollReveal>
                <HomeCtaBlocks />
              </ScrollReveal>
            </div>
            <div className="hidden lg:block lg:order-9">
              <ScrollReveal>
                <Suspense fallback={<SectionSkeleton />}>
                  <BlogPromo locale="es" />
                </Suspense>
              </ScrollReveal>
            </div>
          </>
        )}
      </main>
      {/* Footer rendered only on desktop UA — saves payload on mobile */}
      {!mobile && (
        <div className="hidden lg:block">
          <Footer />
        </div>
      )}
      <BottomNav />
    </>
  );
}
