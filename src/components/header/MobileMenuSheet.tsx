"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import NavItem from "./NavItem";
import {
  sheetIconLinkActiveClass,
  sheetIconLinkClass,
  sheetLinkActiveClass,
  sheetLinkClass,
} from "./nav-classes";

/**
 * Мобильное меню (Radix Dialog) — вынесено из Header в отдельный чанк.
 *
 * ЗАЧЕМ. Меню открывают редко, а `@radix-ui/react-dialog` вместе с
 * FocusScope/DismissableLayer/Presence ехал в первом же бандле КАЖДОЙ страницы.
 * Header грузит этот модуль через `next/dynamic({ ssr: false })` и прогревает
 * его на pointerenter/touchstart/focus бургера, поэтому к моменту отпускания
 * пальца чанк обычно уже в кэше.
 *
 * Разметка, классы и поведение (закрытие по клику на ссылку) — один в один как
 * было внутри Header: любое расхождение видно глазом на проде.
 *
 * Данные приходят уже посчитанными (active/exact), чтобы этот модуль не тянул
 * за собой usePathname и логику подсветки.
 */
export type MobileMenuItem = {
  name: string;
  href: string;
  active: boolean;
  exact: boolean;
  /** Только для блока «Soluciones» — иконка слева от названия. */
  Icon?: React.ComponentType<{ className?: string }>;
};

export default function MobileMenuSheet({
  open,
  onOpenChange,
  items,
  solutions,
  solutionsLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MobileMenuItem[];
  solutions: MobileMenuItem[];
  solutionsLabel: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[85%] max-w-sm p-0">
        <SheetTitle className="sr-only">Menú</SheetTitle>
        <nav className="flex h-full flex-col gap-0.5 overflow-y-auto p-4 pt-14">
          {items.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              active={item.active}
              exact={item.exact}
              onClick={() => onOpenChange(false)}
              className={sheetLinkClass}
              activeClassName={sheetLinkActiveClass}
            >
              {item.name}
            </NavItem>
          ))}
          <div className="my-2 h-px bg-gray-200" />
          <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {solutionsLabel}
          </span>
          {solutions.map(({ name, href, active, exact, Icon }) => (
            <NavItem
              key={href}
              href={href}
              active={active}
              exact={exact}
              onClick={() => onOpenChange(false)}
              className={sheetIconLinkClass}
              activeClassName={sheetIconLinkActiveClass}
            >
              {Icon ? <Icon className="w-5 h-5 text-brand-green-dark" /> : null}
              {name}
            </NavItem>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
