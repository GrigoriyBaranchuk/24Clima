"use client";

import { useEffect } from "react";
import { metaPixelEvent } from "./MetaPixel";

type Props = { serviceName: string };

export default function ServicePageViewContent({ serviceName }: Props) {
  useEffect(() => {
    metaPixelEvent("ViewContent", { content_name: serviceName });
  }, [serviceName]);

  return null;
}
