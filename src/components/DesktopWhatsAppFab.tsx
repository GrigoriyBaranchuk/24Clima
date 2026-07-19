"use client";

import { metaPixelEvent } from "@/components/MetaPixel";
import { getWhatsAppLink } from "@/lib/constants";
import { WhatsAppFab } from "@24clima/design/components";
import { useTranslations } from "next-intl";

/**
 * The single, globally-mounted floating WhatsApp button (desktop only —
 * BottomNav covers mobile). Composes the shared WhatsAppFab: reveals after
 * 600px of scroll and pulses. Mounted once in each locale layout.
 */
export default function DesktopWhatsAppFab() {
  const tWhatsapp = useTranslations("whatsappMessages");

  return (
    <WhatsAppFab
      href={getWhatsAppLink(tWhatsapp("general"))}
      label="Escríbenos por WhatsApp"
      revealAfterScroll={600}
      className="hidden lg:flex"
      onClick={() => metaPixelEvent("Contact")}
    />
  );
}
