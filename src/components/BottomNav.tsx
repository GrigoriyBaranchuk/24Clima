"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Home, Wrench, FileText, AlertTriangle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import { metaPixelEvent } from "@/components/MetaPixel";

const WHATSAPP_SVG = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function BottomNav() {
  const t = useTranslations("common");
  const tWhatsapp = useTranslations("whatsappMessages");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href);
  };

  const tabs = [
    {
      name: t("home"),
      href: "/" as const,
      icon: Home,
    },
    {
      name: t("services"),
      href: "/servicios" as const,
      icon: Wrench,
    },
    // WhatsApp FAB goes in the middle (rendered separately)
    {
      name: t("blog"),
      href: "/consejos-y-guias" as const,
      icon: FileText,
    },
    {
      name: t("problems"),
      href: "/problemas" as const,
      icon: AlertTriangle,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden"
      aria-label="Navegación principal móvil"
    >
      {/* Background bar */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80" />

      {/* Tab items + FAB */}
      <div
        className="relative flex items-end justify-around w-full"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* First two tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px] transition-colors ${
                active ? "text-[#7BC043]" : "text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold leading-tight">{tab.name}</span>
            </Link>
          );
        })}

        {/* Center WhatsApp FAB — "Escribenos" */}
        <div className="flex flex-col items-center -mt-5 px-1">
          <a
            href={getWhatsAppLink(tWhatsapp("general"))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#25D366] shadow-[0_4px_12px_rgba(37,211,102,0.35)] border-[3px] border-white active:scale-95 transition-transform"
            aria-label="Escribenos por WhatsApp"
            onClick={() => metaPixelEvent("Contact")}
          >
            {WHATSAPP_SVG}
          </a>
          <span className="text-[10px] font-semibold text-[#25D366] mt-0.5 leading-tight">
            Escribenos
          </span>
        </div>

        {/* Last two tabs */}
        {tabs.slice(2).map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px] transition-colors ${
                active ? "text-[#7BC043]" : "text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold leading-tight">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
