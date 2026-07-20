"use client";

import { metaPixelEvent } from "@/components/MetaPixel";
import { Link, usePathname } from "@/i18n/routing";
import { WHATSAPP_DISPLAY, getWhatsAppLink } from "@/lib/constants";
import {
  HeaderNavLink,
  HeaderShell,
  WhatsAppCta,
  type LinkComponentType,
} from "@24clima/design/components";
import { Building2, ChevronDown, Home, Menu, Phone, Tent } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

const HEADER_OFFSET_PX = 80; // h-20

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
  window.scrollTo({ top, behavior: "smooth" });
}

// Localized nav link that bakes in scroll={false}, exposed through the
// package's LinkComponent contract (href/className/children/onClick).
const NavLink: LinkComponentType = ({ href, className, children, onClick }) => (
  <Link href={href} scroll={false} className={className} onClick={onClick}>
    {children}
  </Link>
);

export default function Header() {
  const t = useTranslations("common");
  const tWhatsapp = useTranslations("whatsappMessages");
  const pathname = usePathname();
  // The shell owns the scrolled BACKGROUND. We keep a local listener only for
  // per-slot FOREGROUND colours that must stay legible on both mobile
  // backgrounds (brand-navy-dark unscrolled → white scrolled): the mobile
  // wordmark, the burger, and the language badge.
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const navigation = [
    { name: t("home"), href: "/", isAnchor: false, external: false },
    { name: t("tips"), href: "/consejos-y-guias", isAnchor: false, external: false },
    { name: t("services"), href: "/#servicios", isAnchor: true, external: false },
    { name: t("problems"), href: "/#problemas", isAnchor: true, external: false },
    { name: t("about"), href: "/nosotros", isAnchor: false, external: false },
    {
      name: t("shop"),
      href: "/tienda",
      isAnchor: false,
      external: false,
    },
    { name: t("contact"), href: "/contacto", isAnchor: false, external: false },
  ];
  // Niche segment landings, grouped under the "Soluciones" dropdown.
  const solutions = [
    {
      name: t("navPh"),
      href: "/servicio-para-administradoras-ph",
      Icon: Building2,
    },
    {
      name: t("events"),
      href: "/alquiler-aire-acondicionado-eventos",
      Icon: Tent,
    },
  ];

  const isHomePage = pathname === "/" || pathname === "";

  const handleNavClick = (
    item: (typeof navigation)[0],
    e: React.MouseEvent,
  ) => {
    if (!item.isAnchor) return;
    const id = item.href.split("#")[1];
    if (!id) return;
    if (isHomePage) {
      e.preventDefault();
      scrollToSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== LOGO SLOT =====
  // HeaderShell renders this node in BOTH rows; each treatment is toggled by
  // breakpoint so the mobile wordmark shows < lg and the desktop mark >= lg.
  const logo = (
    <>
      <Link
        href="/"
        scroll={false}
        className="flex lg:hidden items-center gap-2"
      >
        <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span
          className={`font-semibold text-[15px] transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}
        >
          24clima
        </span>
      </Link>
      <Link href="/" scroll={false} className="hidden lg:flex items-center">
        <Image
          src="/images/logo.svg"
          alt="24clima - Servicio de aire acondicionado en Panamá"
          width={160}
          height={50}
          className="h-12 w-auto"
        />
      </Link>
    </>
  );

  // ===== DESKTOP NAV SLOT =====
  const nav = (
    <>
      {navigation.map((item) => (
        <HeaderNavLink
          key={item.name}
          href={item.href}
          LinkComponent={NavLink}
          onClick={(e) => handleNavClick(item, e)}
        >
          {item.name}
        </HeaderNavLink>
      ))}
      {/* "Soluciones" dropdown — niche segment landings (Para PH, eventos).
        Stays app-side (interactive). Links are ALWAYS in the DOM (only
        visually toggled) so they stay crawlable; SEO-reviewed. Motion uses
        opacity+transform only, 150ms, off under reduced-motion. */}
      <div
        className="relative"
        onMouseEnter={() => setSolOpen(true)}
        onMouseLeave={() => setSolOpen(false)}
        onFocus={() => setSolOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setSolOpen(false);
          }
        }}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={solOpen}
          className="inline-flex items-center gap-1 text-base font-medium text-gray-700 transition-colors hover:text-brand-green-dark"
        >
          {t("solutions")}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-150 motion-reduce:transition-none ${
              solOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          role="menu"
          aria-label={t("solutions")}
          className={`absolute right-0 top-full pt-2 w-60 transition-[opacity,transform] duration-150 motion-reduce:transition-none ${
            solOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-1 pointer-events-none"
          }`}
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl">
            {solutions.map(({ name, href, Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                scroll={false}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-green-dark/10 hover:text-brand-green-dark"
              >
                <Icon className="w-4 h-4 text-brand-green-dark" />
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // ===== DESKTOP ACTIONS SLOT =====
  const actions = (
    <>
      <LanguageSwitcher isScrolled={isScrolled} />
      <a
        href={`tel:+50768282120`}
        className="flex items-center gap-2 text-base font-medium text-gray-700 transition-colors hover:text-brand-green-dark"
      >
        <Phone className="w-4 h-4" />
        <span>{WHATSAPP_DISPLAY}</span>
      </a>
      <WhatsAppCta
        href={getWhatsAppLink(tWhatsapp("general"))}
        size="sm"
        onClick={() => metaPixelEvent("Contact")}
      >
        {t("whatsapp")}
      </WhatsAppCta>
    </>
  );

  // ===== MOBILE MENU SLOT =====
  const mobileMenu = (
    <>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isScrolled
                ? "bg-gray-100 text-gray-600"
                : "bg-white/10 text-white/70"
            }`}
            aria-label="Menú"
          >
            <Menu className="w-4 h-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] max-w-sm p-0">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <nav className="flex h-full flex-col gap-0.5 overflow-y-auto p-4 pt-14">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                scroll={false}
                onClick={(e) => {
                  handleNavClick(item, e);
                  setMenuOpen(false);
                }}
                className="rounded-xl px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-gray-200" />
            <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("solutions")}
            </span>
            {solutions.map(({ name, href, Icon }) => (
              <Link
                key={href}
                href={href}
                scroll={false}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100"
              >
                <Icon className="w-5 h-5 text-brand-green-dark" />
                {name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <LanguageSwitcher isScrolled={isScrolled} />
    </>
  );

  return (
    <>
      {/* Skip to main content — keyboard-only accessibility.
        Uses focus-visible (NOT focus) so it appears only on Tab/keyboard
        navigation. On touch/tap (iOS Safari) it stays sr-only and never
        covers the logo. Screen-reader users keep the WCAG 2.4.1 benefit. */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-brand-navy focus-visible:text-white focus-visible:rounded-md focus-visible:text-sm focus-visible:font-semibold focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
      >
        Ir al contenido principal
      </a>
      <HeaderShell
        logo={logo}
        nav={nav}
        actions={actions}
        mobileMenu={mobileMenu}
      />
    </>
  );
}
