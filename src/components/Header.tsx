"use client";

import { metaPixelEvent } from "@/components/MetaPixel";
import TiendaCartLink from "@/features/tienda/components/TiendaCartLink";
import { Link, usePathname } from "@/i18n/routing";
import { WHATSAPP_DISPLAY, getWhatsAppLink } from "@/lib/constants";
import { isHashNav } from "@/lib/nav";
import { SERVICE_SLUGS, SLUG_TO_TRANSLATION_KEY } from "@/lib/services";
import { HeaderShell, WhatsAppCta } from "@24clima/design/components";
import {
  Building2,
  ChevronDown,
  Home,
  Menu,
  Phone,
  ShoppingBag,
  Tent,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

// Class PAIRS, not a base + an override. `text-gray-700` and
// `text-brand-green-dark` are the same Tailwind utility, so appending the
// active colour would leave the winner to stylesheet order, not to the order
// inside the class attribute. Each surface therefore ships a full inactive
// string and a full active string, and NavItem picks one.
const navLinkClass =
  "text-base font-medium text-gray-700 transition-colors hover:text-brand-green-dark";
const navLinkActiveClass =
  "text-base font-semibold text-brand-green-dark transition-colors";
const dropdownLinkClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-green-dark/10 hover:text-brand-green-dark";
const dropdownLinkActiveClass =
  "flex items-center gap-2.5 rounded-xl bg-brand-green-dark/10 px-3 py-2 text-sm font-semibold text-brand-green-dark transition-colors";
const allServicesClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-brand-green-dark transition-colors hover:bg-brand-green-dark/10";
const dropdownGroupTitleClass =
  "px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400";
const sheetLinkClass =
  "rounded-xl px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100";
const sheetLinkActiveClass =
  "rounded-xl bg-gray-100 px-3 py-3 text-base font-semibold text-brand-green-dark transition-colors";
const sheetIconLinkClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100";
const sheetIconLinkActiveClass =
  "flex items-center gap-2.5 rounded-xl bg-gray-100 px-3 py-3 text-base font-semibold text-brand-green-dark transition-colors";
const tiendaClass =
  "inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-green-dark hover:text-brand-green-dark";
const tiendaActiveClass =
  "inline-flex items-center gap-2 rounded-full border border-brand-green-dark px-4 py-2 text-sm font-semibold text-brand-green-dark transition-colors";

// One active-aware link for EVERY nav surface: desktop nav, dropdown, mobile
// sheet, Tienda button. Deliberately replaces the package's HeaderNavLink
// here: its contract (href/className/children/onClick) cannot carry
// aria-current, and it appends className instead of swapping it. The desktop
// look is kept byte-identical to the package's NAV_CLASS above — if the
// package ever grows an `active` prop, fold this back into it.
// Defined at module scope, NOT inside Header: a component re-created on every
// render would remount the whole nav on each scroll tick.
function NavItem({
  href,
  active,
  exact,
  className,
  activeClassName,
  role,
  onClick,
  children,
}: {
  href: string;
  /** Current page OR one of its ancestors — drives the highlight. */
  active: boolean;
  /** Exactly the current page — only this earns aria-current="page". */
  exact: boolean;
  className: string;
  activeClassName: string;
  role?: "menuitem";
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      // Якорь (/#servicios) — гасим авто-скролл, чтобы браузер дошёл до
      // хэша. Переход на страницу — дефолт next/link, т.е. скролл к верху.
      scroll={isHashNav(href) ? false : undefined}
      role={role}
      onClick={onClick}
      // "page" is reserved for the exact page; an ancestor section link gets
      // the generic "true" (ARIA has no "section" token).
      aria-current={exact ? "page" : active ? "true" : undefined}
      className={active ? activeClassName : className}
    >
      {children}
    </Link>
  );
}

// showCartLink: passed by TiendaShell so the cart entry point renders only on
// /tienda pages; marketing pages keep the header unchanged.
export default function Header({
  showCartLink = false,
}: { showCartLink?: boolean }) {
  const t = useTranslations("common");
  const tWhatsapp = useTranslations("whatsappMessages");
  // The shell owns the scrolled BACKGROUND. We keep a local listener only for
  // per-slot FOREGROUND colours that must stay legible on both mobile
  // backgrounds (brand-navy-dark unscrolled → white scrolled): the mobile
  // wordmark, the burger, and the language badge.
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Desktop keeps only destination pages; everything service-shaped lives in
  // the grouped "Servicios" dropdown. "Inicio" is dropped (logo = home) and
  // "Tienda" moves to the actions slot as a distinct shop entry point.
  const desktopNav = [
    { name: t("tips"), href: "/consejos-y-guias" },
    { name: t("about"), href: "/nosotros" },
    { name: t("contact"), href: "/contacto" },
  ];
  // Mobile sheet keeps the fuller list (incl. Inicio and Tienda) but links to
  // the real hub pages instead of homepage anchors.
  const mobileNav = [
    { name: t("home"), href: "/" },
    { name: t("tips"), href: "/consejos-y-guias" },
    { name: t("services"), href: "/servicios" },
    { name: t("problems"), href: "/problemas" },
    { name: t("about"), href: "/nosotros" },
    { name: t("shop"), href: "/tienda" },
    { name: t("contact"), href: "/contacto" },
  ];
  // Money pages, one per service slug — short nav labels, not the long SEO
  // page titles from services.<key>.title.
  const serviceLinks = SERVICE_SLUGS.map((slug) => ({
    name: t(`serviceNav.${SLUG_TO_TRANSLATION_KEY[slug]}`),
    href: `/servicios/${slug}`,
  }));
  const problemLinks = [
    { name: t("commonProblems"), href: "/problemas" },
    { name: t("diagnosis"), href: "/diagnostico" },
  ];
  // Niche segment landings (Para PH, eventos).
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

  // Production URLs all carry a trailing slash (next.config `trailingSlash:
  // true`), so usePathname yields "/nosotros/", not "/nosotros". next-intl
  // already strips the locale prefix ("/en/nosotros/" -> "/nosotros/"); the
  // trailing slash is ours to normalize.
  const rawPathname = usePathname();
  const pathname =
    rawPathname !== "/" && rawPathname.endsWith("/")
      ? rawPathname.slice(0, -1)
      : rawPathname;

  // Exact page — the only match that earns aria-current="page". Used for the
  // dropdown leaves, where "/servicios" must NOT light up on
  // "/servicios/limpieza" (that page has its own entry).
  const isCurrentPage = (href: string) => pathname === href;
  // Section match: the page itself or anything under it, so a blog post keeps
  // "Consejos" lit. "/" is exact-only, otherwise it would match everything.
  // The blog admin is excluded on purpose: it is a private dashboard, not the
  // public guides section the nav item points at.
  const isSection = (href: string) => {
    if (href === "/") return pathname === "/";
    if (
      href === "/consejos-y-guias" &&
      pathname.startsWith("/consejos-y-guias/admin")
    ) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  // The trigger is a <button>, so it carries no aria-current — it lights up
  // when ANY page reachable from the dropdown is open.
  const servicesActive =
    isSection("/servicios") ||
    problemLinks.some(({ href }) => isSection(href)) ||
    solutions.some(({ href }) => isSection(href));

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
      <Link href="/" className="flex lg:hidden items-center gap-2">
        <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span
          className={`font-semibold text-[15px] transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}
        >
          24clima
        </span>
      </Link>
      <Link href="/" className="hidden lg:flex items-center">
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
      {/* "Servicios" grouped dropdown — service pages, problem/diagnóstico
        hubs, and niche segment landings. Stays app-side (interactive). Links
        are ALWAYS in the DOM (only visually toggled) so they stay crawlable;
        SEO-reviewed. Motion uses opacity+transform only, 150ms, off under
        reduced-motion. `invisible` keeps hidden links out of the tab order. */}
      <div
        className="relative"
        onMouseEnter={() => setServicesOpen(true)}
        onMouseLeave={() => setServicesOpen(false)}
        onFocus={() => setServicesOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setServicesOpen(false);
          }
        }}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={servicesOpen}
          className={
            servicesActive
              ? "inline-flex items-center gap-1 text-base font-semibold text-brand-green-dark transition-colors"
              : "inline-flex items-center gap-1 text-base font-medium text-gray-700 transition-colors hover:text-brand-green-dark"
          }
        >
          {t("services")}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-150 motion-reduce:transition-none ${
              servicesOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          role="menu"
          aria-label={t("services")}
          className={`absolute left-0 top-full pt-2 w-[38rem] transition-[opacity,transform] duration-150 motion-reduce:transition-none ${
            servicesOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-1 pointer-events-none"
          }`}
        >
          <div className="grid grid-cols-3 gap-x-2 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl">
            {/* Eight service links no longer fit one column, so they run across
                two sub-columns. The crawlable pattern is untouched: every link
                stays in the DOM, hidden only visually. */}
            <div className="col-span-2">
              <span className={dropdownGroupTitleClass}>{t("services")}</span>
              <div className="grid grid-cols-2 gap-x-2">
                {serviceLinks.map(({ name, href }) => (
                  <NavItem
                    key={href}
                    href={href}
                    active={isCurrentPage(href)}
                    exact={isCurrentPage(href)}
                    role="menuitem"
                    className={dropdownLinkClass}
                    activeClassName={dropdownLinkActiveClass}
                  >
                    {name}
                  </NavItem>
                ))}
              </div>
              <NavItem
                href="/servicios"
                active={isCurrentPage("/servicios")}
                exact={isCurrentPage("/servicios")}
                role="menuitem"
                className={allServicesClass}
                activeClassName={dropdownLinkActiveClass}
              >
                {t("allServices")}
              </NavItem>
            </div>
            <div>
              <span className={dropdownGroupTitleClass}>{t("problems")}</span>
              {problemLinks.map(({ name, href }) => (
                <NavItem
                  key={href}
                  href={href}
                  active={isCurrentPage(href)}
                  exact={isCurrentPage(href)}
                  role="menuitem"
                  className={dropdownLinkClass}
                  activeClassName={dropdownLinkActiveClass}
                >
                  {name}
                </NavItem>
              ))}
              <span className={dropdownGroupTitleClass}>{t("solutions")}</span>
              {solutions.map(({ name, href, Icon }) => (
                <NavItem
                  key={href}
                  href={href}
                  active={isCurrentPage(href)}
                  exact={isCurrentPage(href)}
                  role="menuitem"
                  className={dropdownLinkClass}
                  activeClassName={dropdownLinkActiveClass}
                >
                  <Icon className="w-4 h-4 text-brand-green-dark" />
                  {name}
                </NavItem>
              ))}
            </div>
          </div>
        </div>
      </div>
      {desktopNav.map((item) => (
        <NavItem
          key={item.name}
          href={item.href}
          active={isSection(item.href)}
          exact={isCurrentPage(item.href)}
          className={navLinkClass}
          activeClassName={navLinkActiveClass}
        >
          {item.name}
        </NavItem>
      ))}
    </>
  );

  // ===== DESKTOP ACTIONS SLOT =====
  // Priority order: WhatsApp is the ONLY green (dominant) action; Tienda is a
  // neutral secondary button; phone is a quiet icon-only tel: link (full
  // number stays visible in the footer and /contacto).
  const actions = (
    <>
      <LanguageSwitcher isScrolled={isScrolled} />
      <NavItem
        href="/tienda"
        active={isSection("/tienda")}
        exact={isCurrentPage("/tienda")}
        className={tiendaClass}
        activeClassName={tiendaActiveClass}
      >
        <ShoppingBag className="w-4 h-4" />
        {t("shop")}
      </NavItem>
      {showCartLink && <TiendaCartLink variant="desktop" />}
      <a
        href="tel:+50768282120"
        aria-label={`${t("callNow")}: ${WHATSAPP_DISPLAY}`}
        title={`${t("callNow")}: ${WHATSAPP_DISPLAY}`}
        className="flex w-9 h-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-brand-green-dark/40 hover:text-brand-green-dark"
      >
        <Phone className="w-4 h-4" />
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
      {showCartLink && (
        <TiendaCartLink variant="mobile" isScrolled={isScrolled} />
      )}
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
            {mobileNav.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                active={isSection(item.href)}
                exact={isCurrentPage(item.href)}
                onClick={() => setMenuOpen(false)}
                className={sheetLinkClass}
                activeClassName={sheetLinkActiveClass}
              >
                {item.name}
              </NavItem>
            ))}
            <div className="my-2 h-px bg-gray-200" />
            <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("solutions")}
            </span>
            {solutions.map(({ name, href, Icon }) => (
              <NavItem
                key={href}
                href={href}
                active={isSection(href)}
                exact={isCurrentPage(href)}
                onClick={() => setMenuOpen(false)}
                className={sheetIconLinkClass}
                activeClassName={sheetIconLinkActiveClass}
              >
                <Icon className="w-5 h-5 text-brand-green-dark" />
                {name}
              </NavItem>
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
