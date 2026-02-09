"use client";

import { metaPixelEvent } from "./MetaPixel";

type Props = {
  href: string;
  eventName: "Lead" | "Contact";
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export default function TrackedWhatsAppLink({
  href,
  eventName,
  children,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => metaPixelEvent(eventName)}
    >
      {children}
    </a>
  );
}
