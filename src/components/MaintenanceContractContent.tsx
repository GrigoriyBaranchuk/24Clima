import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Check, Star, MessageCircle, Building2, ArrowRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import SectionDividerStroke from "@/components/SectionDividerStroke";

/**
 * Shared content for /contrato-mantenimiento-aire-acondicionado/ across locale route groups.
 * 3 tier cards (Básico / Estándar / Premium) — all SSR with static prices, names, features.
 * Per the SEO review: the JSON-LD Offer price + name MUST match the visible static text exactly.
 * The interactive per-unit calculator is a separate iteration.
 */
export default async function MaintenanceContractContent() {
  const t = await getTranslations("maintenanceContract");

  const tiers = [
    {
      key: "basic" as const,
      name: t("tierBasicName"),
      price: t("tierBasicPrice"),
      priceNote: t("tierBasicPriceNote"),
      description: t("tierBasicDescription"),
      features: [
        t("tierBasicFeature1"),
        t("tierBasicFeature2"),
        t("tierBasicFeature3"),
        t("tierBasicFeature4"),
      ],
      highlight: false,
    },
    {
      key: "standard" as const,
      name: t("tierStandardName"),
      price: t("tierStandardPrice"),
      priceNote: t("tierStandardPriceNote"),
      description: t("tierStandardDescription"),
      features: [
        t("tierStandardFeature1"),
        t("tierStandardFeature2"),
        t("tierStandardFeature3"),
        t("tierStandardFeature4"),
      ],
      highlight: true,
    },
    {
      key: "premium" as const,
      name: t("tierPremiumName"),
      price: t("tierPremiumPrice"),
      priceNote: t("tierPremiumPriceNote"),
      description: t("tierPremiumDescription"),
      features: [
        t("tierPremiumFeature1"),
        t("tierPremiumFeature2"),
        t("tierPremiumFeature3"),
        t("tierPremiumFeature4"),
      ],
      highlight: false,
    },
  ];

  return (
    <article>
      {/* Hero — warm gradient, decorative divider */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#f8faf6] via-white to-white">
        <div className="container mx-auto px-4 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 max-w-4xl text-center">
          <h1
            className="text-3xl lg:text-[3.5rem] font-semibold text-[#1e3a5f] leading-[1.1] mb-6"
            style={{ letterSpacing: "-0.5px" }}
          >
            {t("h1")}
          </h1>
          <div className="max-w-[180px] mx-auto mb-7">
            <SectionDividerStroke width={1.5} />
          </div>
          <p className="text-xl lg:text-2xl text-[#1e3a5f]/85 leading-relaxed mb-4 max-w-2xl mx-auto">
            {t("heroLead")}
          </p>
          <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t("heroSub")}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">

      {/* Tier cards — hover lift on non-highlighted, glow shadow on highlighted */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={`relative rounded-2xl p-7 lg:p-8 flex flex-col transition-[transform,box-shadow] ${
              tier.highlight
                ? "bg-gradient-to-br from-[#7BC043]/10 to-[#0F9D58]/5 border-2 border-[#7BC043] shadow-xl shadow-[#7BC043]/20 lg:-translate-y-2 hover:shadow-2xl hover:shadow-[#7BC043]/30"
                : "bg-white border border-gray-200 shadow hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:shadow-lg"
            }`}
          >
            {tier.highlight && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#7BC043] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                {t("tierLabel")}
              </div>
            )}
            <h2 className="text-xl lg:text-2xl font-semibold text-[#1e3a5f] mb-2">{tier.name}</h2>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">{tier.description}</p>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-[#1e3a5f]" style={{ fontVariantNumeric: "tabular-nums" }}>
                {tier.price}
              </span>
              <p className="text-sm text-gray-500 mt-1">{tier.priceNote}</p>
            </div>
            <ul className="space-y-2 mb-7 flex-grow">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-[#7BC043] mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              className={`w-full ${
                tier.highlight
                  ? "bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  : "bg-[#1e3a5f] hover:bg-[#0d2240] text-white"
              }`}
            >
              <TrackedWhatsAppLink
                href={getWhatsAppLink(t("tierCtaWhatsappMessage", { plan: tier.name, units: "___" }))}
                eventName="Lead"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("tierCtaButton")}
              </TrackedWhatsAppLink>
            </Button>
          </div>
        ))}
      </section>

      {/* Calculator placeholder note (real interactive calc is a follow-up iteration) */}
      <section className="max-w-3xl mx-auto bg-[#f8faf6] rounded-2xl p-6 lg:p-8 text-center mb-12">
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{t("calculatorNote")}</p>
      </section>

      {/* Cross-link to PH-admin landing — sibling page handshake */}
      <section className="max-w-5xl mx-auto mb-12">
        <Link
          href="/servicio-para-administradoras-ph"
          className="group flex items-center justify-between gap-6 p-6 lg:p-8 rounded-2xl border-2 border-[#0F9D58]/30 bg-gradient-to-r from-[#0F9D58]/5 to-[#7BC043]/5 hover:from-[#0F9D58]/10 hover:to-[#7BC043]/10 hover:border-[#0F9D58] transition-colors"
        >
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#0F9D58] flex items-center justify-center group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F9D58] mb-1">
                {t("breadcrumb")}
              </p>
              <p className="text-lg lg:text-xl font-semibold text-[#1e3a5f]">
                {t("footerCtaTitle")}
              </p>
            </div>
          </div>
          <ArrowRight className="hidden md:block w-6 h-6 text-[#0F9D58] flex-shrink-0 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform" />
        </Link>
      </section>

      {/* Footer CTA */}
      <section className="max-w-3xl mx-auto bg-gradient-to-br from-[#1e3a5f] via-[#152e4a] to-[#0d2240] rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#7BC043]/20 blur-3xl pointer-events-none"
        />
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 relative z-10">{t("footerCtaTitle")}</h2>
        <p className="text-white/85 mb-7 text-base lg:text-lg relative z-10">{t("footerCtaText")}</p>
        <Button
          asChild
          size="lg"
          className="relative z-10 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base px-8 py-6 shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        >
          <TrackedWhatsAppLink
            href={getWhatsAppLink(t("footerCtaWhatsappMessage"))}
            eventName="Lead"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t("footerCtaButton")}
          </TrackedWhatsAppLink>
        </Button>
      </section>
      </div>
    </article>
  );
}
