"use client";

import { Link } from "@/i18n/routing";
import { isHashNav } from "@/lib/nav";

// One active-aware link for EVERY nav surface: desktop nav, dropdown, mobile
// sheet, Tienda button. Deliberately replaces the package's HeaderNavLink
// here: its contract (href/className/children/onClick) cannot carry
// aria-current, and it appends className instead of swapping it. The desktop
// look is kept byte-identical to the package's NAV_CLASS — if the package
// ever grows an `active` prop, fold this back into it.
// Defined at module scope, NOT inside Header: a component re-created on every
// render would remount the whole nav on each scroll tick.
//
// Вынесено из Header.tsx в отдельный модуль, чтобы шапка и лениво
// подгружаемое мобильное меню (./MobileMenuSheet) делили один компонент.
export default function NavItem({
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
