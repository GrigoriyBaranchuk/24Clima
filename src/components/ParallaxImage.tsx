"use client";

import { useEffect, useState } from "react";

type ParallaxImageProps = {
  src: string;
  alt?: string;
  className?: string;
  ratio?: number;
};

export default function ParallaxImage({
  src,
  alt = "",
  className = "",
  ratio = 0.15,
}: ParallaxImageProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <figure className={`my-8 overflow-hidden rounded-xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        style={{
          transform: `translateY(${offset * ratio}px) scale(1.05)`,
          willChange: "transform",
        }}
      />
    </figure>
  );
}
