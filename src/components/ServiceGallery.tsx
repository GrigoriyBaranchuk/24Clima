import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LiteYouTube from "@/components/LiteYouTube";
import type { ServiceSlug } from "@/lib/services";

type GalleryItem = {
  src: string;
  /** Tamaño intrínseco real del webp (todas las fotos son 4:3). */
  width: number;
  height: number;
  /** Clave dentro del namespace `serviceGallery` de messages. */
  altKey: string;
};

/**
 * Fotos por servicio. Un único origen para los dos árboles de rutas —
 * `(es)` y `[locale]` importan este mismo componente.
 *
 * Las fotos son de obras hechas con los mismos componentes que instalamos
 * (VIP Aire, Panamá): por eso el pie de foto lo dice tal cual y no habla de
 * «nuestros trabajos» (Ley 45 / ACODECO).
 */
const SERVICE_GALLERY: Partial<Record<ServiceSlug, GalleryItem[]>> = {
  gypsum: [
    { src: "/uploads/gypsum-galeria-1-opt.webp", width: 1200, height: 900, altKey: "gypsum1" },
    { src: "/uploads/gypsum-galeria-2-opt.webp", width: 1200, height: 900, altKey: "gypsum2" },
    { src: "/uploads/gypsum-galeria-3-opt.webp", width: 1200, height: 900, altKey: "gypsum3" },
    { src: "/uploads/gypsum-galeria-4-opt.webp", width: 960, height: 720, altKey: "gypsum4" },
  ],
  "aire-acondicionado-por-ductos": [
    { src: "/uploads/ductos-galeria-1-opt.webp", width: 1200, height: 900, altKey: "ductos1" },
    { src: "/uploads/ductos-galeria-2-opt.webp", width: 996, height: 747, altKey: "ductos2" },
    { src: "/uploads/ductos-galeria-3-opt.webp", width: 581, height: 436, altKey: "ductos3" },
    { src: "/uploads/ductos-galeria-4-opt.webp", width: 1200, height: 900, altKey: "ductos4" },
  ],
};

/** Vídeo del socio de control de calidad (obra en Alemania), solo en gypsum. */
const SERVICE_VIDEO: Partial<Record<ServiceSlug, string>> = {
  gypsum: "wHiH9qb3hf0",
};

/**
 * Galería de fotos del servicio: carrete con scroll-snap en móvil, rejilla de
 * 4 en lg. Sin JS, sin autoplay, sin lightbox — se pasa con el dedo o la rueda.
 * Mismo patrón que BlogPromo.
 */
export default async function ServiceGallery({ service }: { service: ServiceSlug }) {
  const items = SERVICE_GALLERY[service];
  if (!items) return null;

  const t = await getTranslations("serviceGallery");
  const videoId = SERVICE_VIDEO[service];

  return (
    <section className="py-12 lg:py-20 bg-white" aria-labelledby="service-gallery-heading">
      <div className="container mx-auto px-4 lg:px-8">
        <h2
          id="service-gallery-heading"
          className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-8 lg:mb-10"
        >
          {t("title")}
        </h2>

        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible max-w-5xl mx-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item) => (
            <div
              key={item.src}
              className="min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <Image
                src={item.src}
                alt={t(item.altKey)}
                width={item.width}
                height={item.height}
                loading="lazy"
                sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 25vw"
                className="w-full h-auto aspect-[4/3] object-cover"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-xs lg:text-sm text-gray-500 mt-4 max-w-3xl mx-auto">
          {t("caption")}
        </p>

        {videoId && (
          <div className="max-w-3xl mx-auto mt-10 lg:mt-14">
            <LiteYouTube videoId={videoId} title={t("videoTitle")} playLabel={t("videoPlay")} />
            <p className="text-center text-xs lg:text-sm text-gray-500 mt-3">
              {t("videoCaption")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
