import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Snowflake,
  Tent,
  Store,
  Presentation,
  Sparkles,
  UtensilsCrossed,
  Users,
  HardHat,
  Droplets,
  CloudRain,
  Sun,
  ThumbsUp,
  Thermometer,
  Zap,
  Volume2,
  ClipboardCheck,
  ShieldCheck,
  Factory,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { getWhatsAppLink, WHATSAPP_DISPLAY } from "@/lib/constants";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import SectionDividerStroke from "@/components/SectionDividerStroke";

/**
 * Shared content for /alquiler-aire-acondicionado-eventos/ across locale route groups.
 * Lead-gen landing: no fleet claims — frames a "solución a medida" with WhatsApp/visita CTA.
 * H1, hero, sections, FAQ — all SSR.
 */
export default async function EventCoolingContent() {
  const t = await getTranslations("eventCooling");

  const useCases = [
    { key: "uc1" as const, Icon: Tent },
    { key: "uc2" as const, Icon: Store },
    { key: "uc3" as const, Icon: Presentation },
    { key: "uc4" as const, Icon: Sparkles },
    { key: "uc5" as const, Icon: UtensilsCrossed },
    { key: "uc6" as const, Icon: Snowflake },
    { key: "uc7" as const, Icon: Users },
    { key: "uc8" as const, Icon: HardHat },
  ];

  const whyItems = [
    { key: "why1" as const, Icon: Droplets },
    { key: "why2" as const, Icon: CloudRain },
    { key: "why3" as const, Icon: Sun },
    { key: "why4" as const, Icon: ThumbsUp },
  ];

  const packages = [
    { title: "pkg1Title" as const, text: "pkg1Text" as const, Icon: Snowflake },
    { title: "pkg2Title" as const, text: "pkg2Text" as const, Icon: Tent },
    { title: "pkg3Title" as const, text: "pkg3Text" as const, Icon: ShieldCheck },
    { title: "pkg4Title" as const, text: "pkg4Text" as const, Icon: Factory },
  ];

  const techItems = [
    { key: "tech1" as const, Icon: Thermometer },
    { key: "tech2" as const, Icon: Zap },
    { key: "tech3" as const, Icon: Volume2 },
    { key: "tech4" as const, Icon: ClipboardCheck },
  ];

  return (
    <article>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#f1f7fb] via-white to-white">
        <div className="container mx-auto px-4 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1e3a5f] mb-5 px-3 py-1 rounded-full border border-[#1e3a5f]/20 bg-[#1e3a5f]/5">
            <Snowflake className="w-3.5 h-3.5" />
            {t("badge")}
          </p>
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
          <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-9 max-w-2xl mx-auto">
            {t("heroSub")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base px-8 py-6 shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/50 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              <TrackedWhatsAppLink href={getWhatsAppLink(t("whatsappMessage"))} eventName="Lead">
                <MessageCircle className="w-5 h-5 mr-2" />
                {t("ctaPrimary")}
              </TrackedWhatsAppLink>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-[#1e3a5f]/30 text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-medium text-base px-8 py-6"
            >
              <TrackedWhatsAppLink href={getWhatsAppLink(t("whatsappVisita"))} eventName="Lead">
                {t("ctaSecondary")}
              </TrackedWhatsAppLink>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-5 max-w-xl mx-auto">{t("heroMicro")}</p>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        {/* Use cases */}
        <section className="max-w-5xl mx-auto mb-20 lg:mb-28">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f]">{t("useCasesTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map(({ key, Icon }) => (
              <div
                key={key}
                className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#1e3a5f]/40 hover:shadow-md transition-[box-shadow,border-color,transform] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-[#1e3a5f] transition-colors">
                  <Icon className="w-5 h-5 text-[#1e3a5f] group-hover:text-white transition-colors" />
                </div>
                <p className="text-base text-gray-700 leading-relaxed">{t(key)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Panama needs real cooling */}
        <section className="max-w-5xl mx-auto mb-20 lg:mb-28">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-10 text-center">
            {t("whyTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {whyItems.map(({ key, Icon }) => (
              <div key={key} className="flex items-start gap-4 p-6 rounded-2xl bg-[#f1f7fb]">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1e3a5f]" />
                </div>
                <p className="text-base text-gray-700 leading-relaxed">{t(key)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto mb-20 lg:mb-28">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-10 text-center">
            {t("howTitle")}
          </h2>
          <ol className="relative space-y-8">
            <span
              aria-hidden="true"
              className="absolute left-7 lg:left-10 top-12 bottom-12 w-px bg-gradient-to-b from-[#1e3a5f]/30 via-[#1e3a5f]/15 to-transparent hidden sm:block"
            />
            {(["step1", "step2", "step3", "step4", "step5", "step6"] as const).map((key, i) => (
              <li key={key} className="relative flex items-start gap-5 lg:gap-7">
                <span
                  className="flex-shrink-0 w-14 h-14 lg:w-20 lg:h-20 rounded-2xl bg-white border border-[#1e3a5f]/30 text-[#1e3a5f] font-bold flex items-center justify-center text-2xl lg:text-4xl shadow-sm relative z-10"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed pt-3 lg:pt-6">{t(key)}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Packages */}
        <section className="max-w-5xl mx-auto mb-20 lg:mb-28">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-10 text-center">
            {t("packagesTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {packages.map(({ title, text, Icon }) => (
              <div
                key={title}
                className="p-7 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#1e3a5f]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">{t(title)}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{t(text)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical confidence */}
        <section className="max-w-4xl mx-auto mb-20 lg:mb-28 bg-[#f8faf6] rounded-2xl p-8 lg:p-10">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-8 flex items-center gap-3">
            <Thermometer className="w-7 h-7 text-[#7BC043]" />
            {t("techTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {techItems.map(({ key, Icon }) => (
              <div key={key} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-[#0F9D58] flex-shrink-0 mt-1" />
                <p className="text-base text-gray-700 leading-relaxed">{t(key)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="max-w-4xl mx-auto mb-20 lg:mb-28">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[#7BC043]" />
            {t("trustTitle")}
          </h2>
          <p className="text-base lg:text-lg text-gray-700 leading-relaxed">{t("trustText")}</p>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-8">{t("faqTitle")}</h2>
          <dl className="space-y-6">
            {([1, 2, 3, 4, 5, 6] as const).map((i) => (
              <div key={i}>
                <dt className="text-lg font-semibold text-[#1e3a5f] mb-2">{t(`faq${i}Q` as "faq1Q")}</dt>
                <dd className="text-base text-gray-700 leading-relaxed">{t(`faq${i}A` as "faq1A")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Footer CTA */}
        <section className="max-w-3xl mx-auto bg-gradient-to-br from-[#1e3a5f] via-[#152e4a] to-[#0d2240] rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#7BC043]/20 blur-3xl pointer-events-none"
          />
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 relative z-10">
            {t("ctaFooterTitle")}
          </h2>
          <p className="text-white/85 mb-7 text-base lg:text-lg relative z-10">{t("ctaFooterText")}</p>
          <Button
            asChild
            size="lg"
            className="relative z-10 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base px-8 py-6 shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            <TrackedWhatsAppLink href={getWhatsAppLink(t("whatsappMessage"))} eventName="Lead">
              <MessageCircle className="w-5 h-5 mr-2" />
              {t("ctaFooterButton")} · {WHATSAPP_DISPLAY}
            </TrackedWhatsAppLink>
          </Button>
          <Link
            href="/areas-de-servicio"
            className="relative z-10 inline-flex items-center gap-1.5 mt-5 text-sm text-white/70 hover:text-white transition-colors"
          >
            {t("coverageLink")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </article>
  );
}
