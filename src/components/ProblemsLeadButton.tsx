"use client";

import { metaPixelEvent } from "@/components/MetaPixel";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ProblemsLeadButtonProps {
  href: string;
  className: string;
  size?: "default" | "sm" | "lg" | "icon";
  children: ReactNode;
}

export default function ProblemsLeadButton({
  href,
  className,
  size,
  children,
}: ProblemsLeadButtonProps) {
  return (
    <Button asChild size={size} className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => metaPixelEvent("Lead")}
      >
        {children}
      </a>
    </Button>
  );
}
