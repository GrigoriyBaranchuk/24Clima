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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              "@id": "https://24clima.com/#organization",
              name: "24clima",
              description: "Servicio de aire acondicionado en Panamá",
              url: "https://24clima.com",
              telephone: "+507-6828-2120",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ciudad de Panamá",
                addressCountry: "PA",
              },
              areaServed: ["Ciudad de Panamá", "Costa del Este", "Punta Pacífica"],
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
              description: "24clima — professional air conditioning service in Panama City.",
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
