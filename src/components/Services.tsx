import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Wind, Thermometer, Droplets, Settings, Zap, ArrowRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import type { ServiceSlug } from "@/lib/services";

export default async function Services() {
  const t = await getTranslations("services");
  const tCommon = await getTranslations("common");
  const tWhatsapp = await getTranslations("whatsappMessages");

  const serviceList: { icon: typeof Droplets; slug: ServiceSlug; translationKey: string }[] = [
    { icon: Droplets, slug: "limpieza", translationKey: "cleaning" },
    { icon: Settings, slug: "mantenimiento", translationKey: "maintenance" },
    { icon: Wrench, slug: "reparacion", translationKey: "repair" },
    { icon: Wind, slug: "instalacion", translationKey: "installation" },
    { icon: Thermometer, slug: "carga-de-gas", translationKey: "gasRecharge" },
    { icon: Zap, slug: "emergencia", translationKey: "emergency" },
  ];

  const services = serviceList.map(({ icon, slug, translationKey }) => ({
    icon,
    slug,
    title: t(`${translationKey}.title`),
    shortTitle: t(`${translationKey}.shortTitle`),
    description: t(`${translationKey}.description`),
    benefits: [t(`${translationKey}.benefit1`), t(`${translationKey}.benefit2`), t(`${translationKey}.benefit3`), t(`${translationKey}.benefit4`)],
  }));

  // Unique icon colors for mobile (matching mockup)
  const mobileIconColors = [
    "from-[#7BC043] to-[#0F9D58]", // green — instalación
    "from-[#4A90D9] to-[#357ABD]", // blue — limpieza
    "from-[#F5A623] to-[#E8961E]", // orange — reparación
    "from-[#E55B8C] to-[#D14577]", // pink — diagnóstico
  ];

  // Only first 4 services shown on mobile
  const mobileServices = services.slice(0, 4);

  return (
    <section id="servicios" className="py-1.5 lg:py-28 bg-[#0d1b2a] lg:bg-transparent lg:section-gradient scroll-mt-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="w-full max-w-3xl mx-auto text-center lg:text-center mb-1.5 lg:mb-16">
          {/* Mobile: uppercase label */}
          <h2 className="lg:hidden text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1.5">
            {t("title")}
          </h2>
          {/* Desktop: large title */}
          <h2 className="hidden lg:block text-5xl font-semibold text-[#1e3a5f] mb-6" style={{ letterSpacing: "-0.2px" }}>
            {t("title")}
          </h2>
          <p className="hidden lg:block text-lg text-gray-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Mobile Grid — dark cards, 4 services, unique icon colors */}
        <div className="grid grid-cols-2 gap-2 lg:hidden">
          {mobileServices.map((service, index) => (
            <Link
              key={index}
              href={`/servicios/${service.slug}`}
              className="flex flex-col items-center text-center py-2.5 px-3 rounded-2xl bg-[#162a3e] active:scale-95 transition-transform"
            >
              <div className={`w-9 h-9 bg-gradient-to-br ${mobileIconColors[index]} rounded-xl flex items-center justify-center mb-1.5`}>
                <service.icon className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-[13px] font-semibold text-white leading-tight">
                {service.shortTitle}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="card-hover border-0 shadow-lg bg-white overflow-hidden group"
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#7BC043] to-[#0F9D58] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl text-[#1e3a5f] group-hover:text-[#0F9D58] transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-base text-gray-700">
                      <div className="w-1.5 h-1.5 bg-[#7BC043] rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0F9D58] text-[#0F9D58] hover:bg-[#0F9D58] hover:text-white"
                  >
                    <TrackedWhatsAppLink
                      href={getWhatsAppLink(`${service.title}`)}
                      eventName="Lead"
                    >
                      {tCommon("requestService")}
                    </TrackedWhatsAppLink>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-[#1e3a5f] hover:text-[#0F9D58] hover:bg-[#0F9D58]/5"
                  >
                    <Link href={`/servicios/${service.slug}`}>
                      <span className="flex items-center justify-center gap-2">
                        {service.title}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner — desktop only (mobile has WhatsApp FAB + BottomNav) */}
        <div className="hidden lg:block mt-16 bg-gradient-to-r from-[#1e3a5f] to-[#0d2240] rounded-2xl p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("urgentTitle")}
          </h3>
          <p className="text-white/80 mb-6 w-full max-w-2xl mx-auto">
            {t("urgentSubtitle")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
          >
            <TrackedWhatsAppLink
              href={getWhatsAppLink(tWhatsapp("emergency"))}
              eventName="Lead"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {tCommon("contactNow")}
            </TrackedWhatsAppLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
