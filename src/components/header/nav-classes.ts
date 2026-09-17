// Class PAIRS, not a base + an override. `text-gray-700` and
// `text-brand-green-dark` are the same Tailwind utility, so appending the
// active colour would leave the winner to stylesheet order, not to the order
// inside the class attribute. Each surface therefore ships a full inactive
// string and a full active string, and NavItem picks one.
//
// Вынесено из Header.tsx, чтобы шапка и лениво подгружаемое мобильное меню
// (./MobileMenuSheet) использовали ОДНИ И ТЕ ЖЕ строки, а не две копии,
// которые разъедутся при первой же правке.

export const navLinkClass =
  "text-base font-medium text-gray-700 transition-colors hover:text-brand-green-dark";
export const navLinkActiveClass =
  "text-base font-semibold text-brand-green-dark transition-colors";
export const dropdownLinkClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-green-dark/10 hover:text-brand-green-dark";
export const dropdownLinkActiveClass =
  "flex items-center gap-2.5 rounded-xl bg-brand-green-dark/10 px-3 py-2 text-sm font-semibold text-brand-green-dark transition-colors";
export const allServicesClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-brand-green-dark transition-colors hover:bg-brand-green-dark/10";
export const dropdownGroupTitleClass =
  "px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400";
export const sheetLinkClass =
  "rounded-xl px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100";
export const sheetLinkActiveClass =
  "rounded-xl bg-gray-100 px-3 py-3 text-base font-semibold text-brand-green-dark transition-colors";
export const sheetIconLinkClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100";
export const sheetIconLinkActiveClass =
  "flex items-center gap-2.5 rounded-xl bg-gray-100 px-3 py-3 text-base font-semibold text-brand-green-dark transition-colors";
export const tiendaClass =
  "inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-green-dark hover:text-brand-green-dark";
export const tiendaActiveClass =
  "inline-flex items-center gap-2 rounded-full border border-brand-green-dark px-4 py-2 text-sm font-semibold text-brand-green-dark transition-colors";
