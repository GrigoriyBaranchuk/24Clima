"use client";

import { metaPixelEvent } from "@/components/MetaPixel";
import { SocialLinks, type SocialLinksProps } from "@24clima/design/components";

/**
 * Client wrapper around the shared SocialLinks so the footer (a server
 * component) can keep firing the Meta Pixel "Contact" event on the WhatsApp
 * tap without becoming a client component itself.
 */
export default function FooterSocial(props: SocialLinksProps) {
  return (
    <SocialLinks {...props} onWhatsAppClick={() => metaPixelEvent("Contact")} />
  );
}
