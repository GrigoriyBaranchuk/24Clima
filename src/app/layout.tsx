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
              description: "Servicio profesional de aire acondicionado en Panamá: instalación, mantenimiento, limpieza profunda, reparación y carga de gas refrigerante. Atención 24/7 en Ciudad de Panamá, Costa del Este, Punta Pacífica y alrededores.",
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
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "00:00",
                closes: "23:59",
              },
              priceRange: "$$",
              sameAs: ["https://wa.me/50768282120"],
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
              description: "24clima — servicio de aire acondicionado en Panamá: instalación, mantenimiento, limpieza, reparación y carga de gas. Atención 24 horas. Ciudad de Panamá, Costa del Este, Punta Pacífica.",
              inLanguage: ["es", "en", "ru"],
              potentialAction: {
                "@type": "ContactAction",
                target: { "@type": "EntryPoint", urlTemplate: "https://wa.me/50768282120" },
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
