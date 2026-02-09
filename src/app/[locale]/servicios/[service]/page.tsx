import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CleaningPackages from "@/components/CleaningPackages";
import Calculator from "@/components/Calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Shield, Star, ArrowLeft } from "lucide-react";
import { Wrench, Wind, Thermometer, Droplets, Settings, Zap } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";

const serviceKeys = [
  "cleaning",
  "maintenance",
  "repair",
  "installation",
  "gas-recharge",
  "emergency",
] as const;

type ServiceKey = (typeof serviceKeys)[number];

const serviceIcons: Record<ServiceKey, React.ComponentType<{ className?: string }>> = {
  cleaning: Droplets,
  maintenance: Settings,
  repair: Wrench,
  installation: Wind,
  "gas-recharge": Thermometer,
  emergency: Zap,
};

const serviceImages: Record<ServiceKey, string> = {
  cleaning: "/uploads/Air-Conditioner-Cleaner-opt.webp",
  maintenance: "/uploads/chistka_condicionera_obsluzhivanie.jpg-2-opt.webp",
  repair: "/uploads/repair-opt.webp",
  installation: "/uploads/install-opt.webp",
  "gas-recharge": "/uploads/refill-opt.webp",
  emergency: "/uploads/page1-opt.webp",
};

const serviceTranslationKeys: Record<ServiceKey, string> = {
  cleaning: "cleaning",
  maintenance: "maintenance",
  repair: "repair",
  installation: "installation",
  "gas-recharge": "gasRecharge",
  emergency: "emergency",
};

export function generateStaticParams() {
  const params: { locale: string; service: string }[] = [];

  for (const locale of locales) {
    for (const service of serviceKeys) {
      params.push({ locale, service });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const translationKey = serviceTranslationKeys[service as ServiceKey];

  if (!translationKey) {
    return { title: "Service Not Found" };
  }

  const title = t(`${translationKey}.title`);
  const description = t(`${translationKey}.description`);

  return {
    title: `${title} | 24clima`,
    description,
    openGraph: {
      title: `${title} | 24clima`,
      description,
    },
  };
}

type Props = {
  params: Promise<{ locale: string; service: string }>;
};

export default async function ServicePage({ params }: Props) {
  const { locale, service } = await params;

  if (!serviceKeys.includes(service as ServiceKey)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tCommon = await getTranslations("common");
  const tWhatsapp = await getTranslations("whatsappMessages");

  const serviceKey = service as ServiceKey;
  const translationKey = serviceTranslationKeys[serviceKey];
  const Icon = serviceIcons[serviceKey];
  const imageUrl = serviceImages[serviceKey];

  const title = t(`${translationKey}.title`);
  const description = t(`${translationKey}.description`);
  const benefits = [
    t(`${translationKey}.benefit1`),
    t(`${translationKey}.benefit2`),
    t(`${translationKey}.benefit3`),
    t(`${translationKey}.benefit4`),
  ];

  const whatsappMessage = encodeURIComponent(
    `${tWhatsapp("general")} - ${title}`
  );
  const whatsappLink = `https://wa.me/50768282120?text=${whatsappMessage}`;

  // Get other services for recommendations
  const otherServices = serviceKeys
    .filter((s) => s !== serviceKey)
    .slice(0, 3)
    .map((s) => ({
      key: s,
      translationKey: serviceTranslationKeys[s],
      Icon: serviceIcons[s],
    }));

  // Check if this is the cleaning service page
  const isCleaningPage = serviceKey === "cleaning";

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Link
                  href="/#servicios"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {tCommon("services")}
                </Link>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-[#7BC043] rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    24/7
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {title}
                </h1>

                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  {description}
                </p>

                {serviceKey === "installation" && (
                  <p className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    {t(`${translationKey}.priceFrom`)}
                    <span className="text-white/80 text-base font-normal ml-1">USD</span>
                  </p>
                )}

                {/* Geo Line */}
                <p className="text-sm text-white/70 mb-6">
                  {tCommon("geoLine")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {tCommon("requestService")}
                    </a>
                  </Button>
                  {isCleaningPage && (
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-[#1e3a5f] hover:bg-gray-100 font-semibold"
                    >
                      <a href="#calculadora">
                        {tCommon("viewServices")}
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/50 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cleaning Packages - Only show on cleaning page */}
        {isCleaningPage && <CleaningPackages />}

        {/* Calculator - Only show on cleaning page */}
        {isCleaningPage && <Calculator />}

        {/* Benefits Section - Only show for non-cleaning pages */}
        {!isCleaningPage && (
          <section className="py-16 lg:py-24 section-gradient">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-12">
                {title}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#7BC043]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6 text-[#7BC043]" />
                      </div>
                      <p className="font-medium text-[#1e3a5f]">{benefit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#1e3a5f] to-[#0d2240]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t("urgentTitle")}
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {t("urgentSubtitle")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {tCommon("contactNow")}
              </a>
            </Button>
          </div>
        </section>

        {/* Other Services */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] text-center mb-12">
              {t("title")}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {otherServices.map(({ key, translationKey: tk, Icon: ServiceIcon }) => (
                <Link key={key} href={`/servicios/${key}`}>
                  <Card className="card-hover border-0 shadow-lg bg-white h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#7BC043] to-[#0F9D58] rounded-xl flex items-center justify-center mb-4">
                        <ServiceIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-[#1e3a5f] mb-2">
                        {t(`${tk}.title`)}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {t(`${tk}.description`)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
