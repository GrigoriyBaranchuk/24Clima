import Image from "next/image";
import { Award, GraduationCap, MapPin } from "lucide-react";
import { EXPERT, getPersonJsonLd } from "@/lib/author-data";

type Variant = "card" | "inline";
type SupportedLocale = "es" | "en" | "ru";

type AuthorBioProps = {
  locale?: SupportedLocale;
  /** "card" — bloque completo para fin de artículo; "inline" — tarjeta compacta en columna lateral. */
  variant?: Variant;
  /** Renderiza también el JSON-LD. Desactivar si ya está presente en la página. */
  includeJsonLd?: boolean;
  className?: string;
};

const LABELS: Record<SupportedLocale, {
  writtenBy: string;
  reviewedBy: string;
  expertise: string;
  serviceArea: string;
  training: string;
  trainingValue: string;
}> = {
  es: {
    writtenBy: "Escrito y revisado por",
    reviewedBy: "Revisado técnicamente por",
    expertise: "Experiencia",
    serviceArea: "Cobertura",
    training: "Formación técnica",
    trainingValue: "Alemania",
  },
  en: {
    writtenBy: "Written and reviewed by",
    reviewedBy: "Technically reviewed by",
    expertise: "Experience",
    serviceArea: "Service area",
    training: "Technical training",
    trainingValue: "Germany",
  },
  ru: {
    writtenBy: "Автор и технический редактор",
    reviewedBy: "Технический редактор",
    expertise: "Опыт",
    serviceArea: "Зона покрытия",
    training: "Техническое обучение",
    trainingValue: "Германия",
  },
};

export default function AuthorBio({
  locale = "es",
  variant = "card",
  includeJsonLd = true,
  className = "",
}: AuthorBioProps) {
  const labels = LABELS[locale];
  const bio = EXPERT.bio[locale];
  const tagline = EXPERT.tagline[locale];
  const jobTitle = EXPERT.jobTitle[locale];

  const experienceText =
    locale === "es"
      ? `${EXPERT.experienceYears}+ años`
      : locale === "en"
      ? `${EXPERT.experienceYears}+ years`
      : `${EXPERT.experienceYears}+ лет`;

  const areaServed =
    locale === "es"
      ? "Ciudad de Panamá y alrededores"
      : locale === "en"
      ? "Panama City and surrounding areas"
      : "Сьюдад-де-Панама и окрестности";

  if (variant === "inline") {
    return (
      <>
        {includeJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonJsonLd(locale)) }}
          />
        )}
        <div
          className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 ${className}`}
          itemScope
          itemType="https://schema.org/Person"
        >
          <Image
            src={EXPERT.image}
            alt={EXPERT.name}
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12 flex-shrink-0"
            itemProp="image"
          />
          <div className="text-sm">
            <p className="font-semibold text-[#1e3a5f] leading-tight" itemProp="name">
              {EXPERT.name}
            </p>
            <p className="text-gray-600 text-xs leading-tight" itemProp="jobTitle">
              {tagline}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getPersonJsonLd(locale)) }}
        />
      )}
      <aside
        className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm ${className}`}
        itemScope
        itemType="https://schema.org/Person"
        aria-labelledby="author-bio-name"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-[#7BC043] mb-4">
          {labels.reviewedBy}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
          <div className="flex-shrink-0">
            <Image
              src={EXPERT.image}
              alt={EXPERT.name}
              width={128}
              height={128}
              className="rounded-2xl object-cover w-24 h-24 sm:w-32 sm:h-32"
              itemProp="image"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="author-bio-name"
              className="text-xl sm:text-2xl font-bold text-[#1e3a5f] mb-1"
              itemProp="name"
            >
              {EXPERT.name}
            </h3>
            <p className="text-[#7BC043] font-medium mb-4" itemProp="jobTitle">
              {jobTitle}
            </p>
            <p className="text-gray-700 leading-relaxed mb-5 text-sm sm:text-base" itemProp="description">
              {bio}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <li className="flex items-start gap-2 text-gray-700">
                <Award className="w-4 h-4 text-[#7BC043] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-gray-500 text-xs">{labels.expertise}</span>
                  <span className="font-medium">{experienceText}</span>
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <GraduationCap className="w-4 h-4 text-[#7BC043] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-gray-500 text-xs">{labels.training}</span>
                  <span className="font-medium">{labels.trainingValue}</span>
                </span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[#7BC043] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-gray-500 text-xs">{labels.serviceArea}</span>
                  <span className="font-medium">{areaServed}</span>
                </span>
              </li>
            </ul>
            {EXPERT.sameAs.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {EXPERT.sameAs.map((url) => {
                  const isInstagram = url.includes("instagram.com");
                  return (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex items-center gap-1 text-[#1e3a5f] hover:text-[#7BC043] font-medium"
                      itemProp="sameAs"
                    >
                      {isInstagram ? "Instagram" : url}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
