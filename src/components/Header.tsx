"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { WHATSAPP_DISPLAY, getWhatsAppLink } from "@/lib/constants";
import { metaPixelEvent } from "@/components/MetaPixel";
import LanguageSwitcher from "./LanguageSwitcher";

const HEADER_OFFSET_PX = 80; // h-20

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Header() {
  const t = useTranslations("common");
  const tWhatsapp = useTranslations("whatsappMessages");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigation = [
    { name: t("home"), href: "/", isAnchor: false },
    { name: t("tips"), href: "/consejos-y-guias", isAnchor: false },
    { name: t("services"), href: "/#servicios", isAnchor: true },
    { name: t("problems"), href: "/#problemas", isAnchor: true },
    { name: t("about"), href: "/nosotros", isAnchor: false },
    { name: t("contact"), href: "/contacto", isAnchor: false },
  ];

  const isHomePage = pathname === "/" || pathname === "";

  const handleNavClick = (item: (typeof navigation)[0], e: React.MouseEvent) => {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    {/* Skip to main content — accessibility (keyboard navigation) */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1e3a5f] focus:text-white focus:rounded-md focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7BC043]"
    >
      Ir al contenido principal
    </a>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-20">
          {/* Logo */}
          <Link href="/" scroll={false} className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="24clima - Servicio de aire acondicionado en Panamá"
              width={160}
              height={50}
              className="h-9 lg:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                scroll={false}
                onClick={(e) => handleNavClick(item, e)}
                className="text-base font-medium text-gray-700 transition-colors hover:text-[#0F9D58]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button & Language Switcher */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher isScrolled={isScrolled} />
            <a
              href={`tel:+50768282120`}
              className="flex items-center gap-2 text-base font-medium text-gray-700 transition-colors hover:text-[#0F9D58]"
            >
              <Phone className="w-4 h-4" />
              <span>{WHATSAPP_DISPLAY}</span>
            </a>
            <Button asChild className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold">
              <a
                href={getWhatsAppLink(tWhatsapp("general"))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => metaPixelEvent("Contact")}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t("whatsapp")}
              </a>
            </Button>
          </div>

          {/* Mobile: Compact header (navigation is in BottomNav) */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher isScrolled={isScrolled} />
            <a
              href="tel:+50768282120"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Llamar a 24clima"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}
