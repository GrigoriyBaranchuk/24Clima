import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { WHATSAPP_DISPLAY, getWhatsAppLink, SOCIAL_LINKS } from "@/lib/constants";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import FooterSocial from "@/components/FooterSocial";
import {
  FooterColumn,
  FooterLink,
  FooterShell,
  type LinkComponentType,
} from "@24clima/design/components";

// Localized footer link that bakes in scroll={false}, exposed through the
// package's LinkComponent contract.
const FooterNavLink: LinkComponentType = ({
  href,
  className,
  children,
  onClick,
}) => (
  <Link href={href} scroll={false} className={className} onClick={onClick}>
    {children}
  </Link>
);

export default async function Footer() {
  const t = await getTranslations("footer");
  const tWhatsapp = await getTranslations("whatsappMessages");
  const tCommon = await getTranslations("common");
  const tPropertyManagement = await getTranslations("propertyManagement");
  const currentYear = new Date().getFullYear();

  const services = [
    { name: t("deepCleaning"), href: "/#servicios" },
    { name: t("preventiveMaintenance"), href: "/#servicios" },
    { name: t("repair"), href: "/#servicios" },
    { name: t("installation"), href: "/#servicios" },
    { name: t("gasRecharge"), href: "/#servicios" },
  ];

  const problems = [
    { name: t("notCooling"), href: "/#problemas" },
    { name: t("leaking"), href: "/#problemas" },
    { name: t("noisy"), href: "/#problemas" },
    { name: t("notTurningOn"), href: "/#problemas" },
  ];

  return (
    <FooterShell
      className="pb-20 lg:pb-0"
      bottomBar={
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-[12px] lg:text-base">
            © {currentYear} 24clima. {t("copyright")}
          </p>
        </div>
      }
    >
      {/* Brand Column — first child spans 2 cols (shell selector). */}
      <div>
        <Link href="/" scroll={false} className="inline-block mb-6">
          <Image
            src="/images/logo.svg"
            alt="24clima - Servicio de aire acondicionado en Panamá"
            width={160}
            height={50}
            className="h-12 w-auto brightness-0 invert"
          />
        </Link>
        <p className="text-[13px] lg:text-base text-gray-400 mb-3 lg:mb-4 leading-relaxed max-w-sm">
          {t("description")}
        </p>
        {/* Geo Line */}
        <p className="text-[12px] lg:text-base text-gray-500 mb-4 lg:mb-6">
          {tCommon("geoLine")}
        </p>
        <FooterSocial
          whatsapp={getWhatsAppLink(tWhatsapp("general"))}
          instagram={SOCIAL_LINKS.instagram}
          facebook={SOCIAL_LINKS.facebook}
          labels={{
            whatsapp: "WhatsApp",
            instagram: "Instagram",
            facebook: "Facebook",
          }}
        />
      </div>

      {/* Services Column — hidden on mobile (BottomNav handles navigation) */}
      <FooterColumn heading={t("servicesTitle")} className="hidden lg:block">
        {services.map((service) => (
          <FooterLink key={service.name} href={service.href}>
            {service.name}
          </FooterLink>
        ))}
      </FooterColumn>

      {/* Problems & Contact Column — hidden on mobile */}
      <FooterColumn heading={t("problemsTitle")} className="hidden lg:block">
        <FooterLink href="/consejos-y-guias" LinkComponent={FooterNavLink}>
          {tCommon("tips")}
        </FooterLink>
        <FooterLink href="/nosotros" LinkComponent={FooterNavLink}>
          {tCommon("about")}
        </FooterLink>
        <FooterLink href="/areas-de-servicio" LinkComponent={FooterNavLink}>
          {tCommon("serviceAreas")}
        </FooterLink>
        <FooterLink
          href="/servicio-para-administradoras-ph"
          LinkComponent={FooterNavLink}
        >
          {tPropertyManagement("breadcrumb")}
        </FooterLink>
        <FooterLink href="/diagnostico" LinkComponent={FooterNavLink}>
          {tCommon("diagnosis")}
        </FooterLink>
        <FooterLink href="/tienda" LinkComponent={FooterNavLink}>
          {tCommon("shop")}
        </FooterLink>
        <FooterLink href="/contacto" LinkComponent={FooterNavLink}>
          {tCommon("contact")}
        </FooterLink>
        {problems.map((problem) => (
          <FooterLink key={problem.name} href={problem.href}>
            {problem.name}
          </FooterLink>
        ))}
        <div className="mt-6">
          <h4 className="font-semibold text-white mb-2">{t("contactTitle")}</h4>
          <TrackedWhatsAppLink
            href={getWhatsAppLink(tWhatsapp("general"))}
            eventName="Contact"
            className="text-base text-whatsapp font-medium hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </TrackedWhatsAppLink>
        </div>
      </FooterColumn>
    </FooterShell>
  );
}
