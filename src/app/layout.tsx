// Порядок важен: сначала токены дизайн-системы, потом локальные стили.
import "@24clima/design/tokens.css";
import "./globals.css";

// Root layout: Next.js requires <html> and <body> here.
// [locale] layout provides locale-specific content (no nested html/body).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/images/logo.svg" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="geo.region" content="PA" />
        <meta name="geo.placename" content="Ciudad de Panamá" />
        <meta name="geo.country" content="Panama" />
        <meta name="ICBM" content="9.0820, -79.4761" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              "@id": "https://24clima.com/#organization",
              name: "24clima",
              description:
                "Servicio profesional de aire acondicionado en Panamá: instalación, mantenimiento, limpieza profunda, reparación y carga de gas refrigerante. Atención 24/7 en Ciudad de Panamá, Costa del Este, Punta Pacífica, Arraiján, La Chorrera y Panamá Oeste.",
              url: "https://24clima.com",
              telephone: "+507-6828-2120",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ciudad de Panamá",
                addressRegion: "Panamá",
                addressCountry: "PA",
              },
              areaServed: [
                "Ciudad de Panamá",
                "Costa del Este",
                "Punta Pacífica",
                "Albrook",
                "Clayton",
                "Panamá Pacífico",
                "San Francisco",
                "El Cangrejo",
                "Obarrio",
                "Bella Vista",
                "Panamá Oeste",
                "Arraiján",
                "Nuevo Arraiján",
                "Vista Alegre",
                "Costa Verde",
                "La Chorrera",
                "El Espino",
                "La Floresta",
                "Vacamonte",
                "Playa Dorada Residences",
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              priceRange: "$29.99 - $600",
              foundingDate: "2024",
              numberOfEmployees: {
                "@type": "QuantitativeValue",
                value: 1,
                unitText: "Maestro HVAC + equipo técnico",
              },
              slogan: "Maestros HVAC en Panamá — servicio 24/7",
              knowsLanguage: ["es", "en", "ru"],
              // aggregateRating намеренно НЕ добавляем: self-serving review
              // (Google, сент. 2019) + дубли @id #organization на страницах
              // статей давали GSC-ошибку «несколько общих оценок» (июль 2026)
              sameAs: [
                "https://wa.me/50768282120",
                "https://www.instagram.com/24clima",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "24clima",
              url: "https://24clima.com",
              description:
                "24clima — servicio de aire acondicionado en Panamá: instalación, mantenimiento, limpieza, reparación y carga de gas. Atención 24 horas. Ciudad de Panamá, Costa del Este, Punta Pacífica.",
              inLanguage: ["es", "en", "ru"],
              potentialAction: {
                "@type": "ContactAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://wa.me/50768282120",
                },
                contactOption: "https://schema.org/TollFree",
              },
            }),
          }}
        />
        <meta name="author" content="24clima" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
