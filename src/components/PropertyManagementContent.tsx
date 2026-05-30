import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Check,
  Building2,
  Users,
  FileText,
  ClipboardCheck,
  MessageCircle,
  CalendarClock,
  Siren,
  ClipboardList,
  Receipt,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { getWhatsAppLink, WHATSAPP_DISPLAY } from "@/lib/constants";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import SectionDividerStroke from "@/components/SectionDividerStroke";

/**
 * Shared content for /servicio-para-administradoras-ph/ across locale route groups.
 * H1, hero, sections, FAQ — all SSR. CTA links to WhatsApp with pre-filled message.
 */
export default async function PropertyManagementContent() {
  const t = await getTranslations("propertyManagement");

  // Visual icons for the "what's included" grid — replaces flat checkmark list
  const includedItems = [
    { key: "section1Item1" as const, Icon: CalendarClock },
    { key: "section1Item2" as const, Icon: Siren },
    { key: "section1Item3" as const, Icon: ClipboardList },
    { key: "section1Item4" as const, Icon: Receipt },
    { key: "section1Item5" as const, Icon: KeyRound },
  ];

  return (
    <article>
      {/* Hero — subtle warm gradient, decorative SVG underline under H1 */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#f8faf6] via-white to-white">
        <div className="container mx-auto px-4 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-20 max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0F9D58] mb-5 px-3 py-1 rounded-full border border-[#0F9D58]/30 bg-[#0F9D58]/5">
            <Building2 className="w-3.5 h-3.5" />
            {t("breadcrumb")}
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
              <TrackedWhatsAppLink
                href={getWhatsAppLink(t("whatsappMessage"))}
                eventName="Lead"
              >
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
              <Link href="/contrato-mantenimiento-aire-acondicionado">
                {t("ctaSecondary")}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
      {/* Section 1: What's included — visual grid of cards, not a checkmark list */}
      <section className="max-w-5xl mx-auto mb-20 lg:mb-28">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] inline-flex items-center gap-3">
            <ClipboardCheck className="w-7 h-7 text-[#7BC043]" />
            {t("section1Title")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {includedItems.map(({ key, Icon }) => (
            <div
              key={key}
              className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#7BC043]/50 hover:shadow-md transition-[box-shadow,border-color,transform] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              <div className="w-11 h-11 rounded-xl bg-[#7BC043]/10 flex items-center justify-center mb-4 group-hover:bg-[#7BC043] transition-colors">
                <Icon className="w-5 h-5 text-[#0F9D58] group-hover:text-white transition-colors" />
              </div>
              <p className="text-base text-gray-700 leading-relaxed">{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Three-way coordination */}
      <section className="max-w-4xl mx-auto mb-16 bg-[#f8faf6] rounded-2xl p-8 lg:p-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-3">
          <Users className="w-7 h-7 text-[#7BC043]" />
          {t("section2Title")}
        </h2>
        <p className="text-base lg:text-lg text-gray-700 leading-relaxed">{t("section2Text")}</p>
      </section>

      {/* Section 3: Common vs private */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-3">
          <Building2 className="w-7 h-7 text-[#7BC043]" />
          {t("section3Title")}
        </h2>
        <p className="text-base lg:text-lg text-gray-700 leading-relaxed">{t("section3Text")}</p>
      </section>

      {/* Section 4: Reserve Fund docs */}
      <section className="max-w-4xl mx-auto mb-16 bg-[#f8faf6] rounded-2xl p-8 lg:p-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-4 flex items-center gap-3">
          <FileText className="w-7 h-7 text-[#7BC043]" />
          {t("section4Title")}
        </h2>
        <p className="text-base lg:text-lg text-gray-700 leading-relaxed">{t("section4Text")}</p>
      </section>

      {/* Section 5: How we start — big numerals with vertical connecting line */}
      <section className="max-w-4xl mx-auto mb-20 lg:mb-28">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-10 text-center">
          {t("section5Title")}
        </h2>
        <ol className="relative space-y-8">
          {/* Connecting line behind the numerals (decorative, aria-hidden) */}
          <span
            aria-hidden="true"
            className="absolute left-7 lg:left-10 top-12 bottom-12 w-px bg-gradient-to-b from-[#7BC043]/40 via-[#7BC043]/20 to-transparent hidden sm:block"
          />
          {(["section5Step1", "section5Step2", "section5Step3", "section5Step4"] as const).map((key, i) => (
            <li key={key} className="relative flex items-start gap-5 lg:gap-7">
              <span
                className="flex-shrink-0 w-14 h-14 lg:w-20 lg:h-20 rounded-2xl bg-white border border-[#7BC043]/40 text-[#0F9D58] font-bold flex items-center justify-center text-2xl lg:text-4xl shadow-sm relative z-10"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed pt-3 lg:pt-6">
                {t(key)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 6: PH served — stat strip + supporting paragraph */}
      <section className="max-w-5xl mx-auto mb-20 lg:mb-28">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-8 text-center">
          {t("section6Title")}
        </h2>
        <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-8">
          {[
            { value: "12+", label: t("breadcrumb") },
            { value: "1.2k+", label: "Unidades" },
            { value: "6", label: "Zonas" },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center p-5 lg:p-6 rounded-2xl bg-gradient-to-br from-[#7BC043]/10 to-transparent border border-[#7BC043]/20"
            >
              <p
                className="text-3xl lg:text-5xl font-bold text-[#0F9D58] leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
              </p>
              <p className="text-xs lg:text-sm text-gray-600 mt-2 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-base lg:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          {t("section6Text")}
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e3a5f] mb-8">{t("faqTitle")}</h2>
        <dl className="space-y-6">
          {([1, 2, 3, 4, 5] as const).map((i) => (
            <div key={i}>
              <dt className="text-lg font-semibold text-[#1e3a5f] mb-2">{t(`faq${i}Q` as "faq1Q")}</dt>
              <dd className="text-base text-gray-700 leading-relaxed">{t(`faq${i}A` as "faq1A")}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Footer CTA */}
      <section className="max-w-3xl mx-auto bg-gradient-to-br from-[#1e3a5f] via-[#152e4a] to-[#0d2240] rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
        {/* Decorative green glow in corner — pure CSS, no animation */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#7BC043]/20 blur-3xl pointer-events-none"
        />
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 relative z-10">
          {t("ctaFooterTitle")}
        </h2>
        <p className="text-white/85 mb-7 text-base lg:text-lg relative z-10">
          {t("ctaFooterText")}
        </p>
        <Button
          asChild
          size="lg"
          className="relative z-10 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base px-8 py-6 shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        >
          <TrackedWhatsAppLink
            href={getWhatsAppLink(t("whatsappMessage"))}
            eventName="Lead"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {t("ctaFooterButton")} · {WHATSAPP_DISPLAY}
          </TrackedWhatsAppLink>
        </Button>
        <Link
          href="/contrato-mantenimiento-aire-acondicionado"
          className="relative z-10 inline-flex items-center gap-1.5 mt-5 text-sm text-white/70 hover:text-white transition-colors"
        >
          {t("ctaSecondary")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
      </div>
    </article>
  );
}
