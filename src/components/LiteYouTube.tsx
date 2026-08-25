"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

type Props = {
  videoId: string;
  /** Título del iframe (a11y) — viene de messages. */
  title: string;
  /** aria-label del botón de reproducción — viene de messages. */
  playLabel: string;
};

/**
 * Fachada de YouTube: hasta el clic solo hay una imagen y un botón, cero JS de
 * YouTube. El iframe (youtube-nocookie) se monta únicamente al pulsar play, así
 * el vídeo no penaliza los Core Web Vitals ni pone cookies sin acción del
 * usuario. CSP: `frame-src` incluye https://www.youtube-nocookie.com.
 */
export default function LiteYouTube({ videoId, title, playLabel }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#1e3a5f]">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={playLabel}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 768px"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F9D58] text-white shadow-lg transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Play className="ml-1 h-7 w-7" fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
