"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useRouter as useNextRouter } from "next/navigation";
import { locales, localeNames, localeCountryCodes, defaultLocale, type Locale } from "@/i18n/config";
import FlagIcon from "@/components/FlagIcon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ isScrolled = false }: { isScrolled?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === defaultLocale) {
      const fullPath = typeof window !== "undefined" ? window.location.pathname : "";
      const rootPath = fullPath.replace(/^\/(en|ru)(\/|$)/, "$2") || "/";
      nextRouter.replace(rootPath || "/");
      return;
    }
    router.replace(pathname, { locale: newLocale, scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Desktop: globe + flag + name */}
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 transition-colors ${
            isScrolled
              ? "text-gray-700 hover:text-[#0F9D58] hover:bg-gray-100"
              : "text-white hover:text-white/80 hover:bg-white/10 lg:text-gray-700 lg:hover:text-[#0F9D58] lg:hover:bg-gray-100"
          }`}
        >
          {/* Mobile: flag + locale code in compact badge */}
          <span className="lg:hidden flex items-center gap-1">
            <FlagIcon code={localeCountryCodes[locale]} />
            <span className="text-xs font-medium uppercase">{locale.toUpperCase()}</span>
          </span>
          {/* Desktop: globe + flag + full name */}
          <span className="hidden lg:flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <FlagIcon code={localeCountryCodes[locale]} />
            <span>{localeNames[locale]}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center gap-2 cursor-pointer ${
              loc === locale ? "bg-[#0F9D58]/10 text-[#0F9D58]" : ""
            }`}
          >
            <FlagIcon code={localeCountryCodes[loc]} />
            <span>{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
