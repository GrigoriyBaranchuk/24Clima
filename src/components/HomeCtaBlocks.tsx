"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function HomeCtaBlocks() {
  const t = useTranslations("homeCta");

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0d2240] rounded-2xl p-8 lg:p-10 text-white">
            <h3 className="text-2xl font-bold mb-3">{t("nosotrosTitle")}</h3>
            <p className="text-white/80 mb-6">{t("nosotrosText")}</p>
            <Button asChild variant="secondary" className="bg-white text-[#1e3a5f] hover:bg-white/90">
              <Link href="/nosotros">
                {t("nosotrosLink")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="bg-gradient-to-br from-[#0F9D58] to-[#128C7E] rounded-2xl p-8 lg:p-10 text-white">
            <h3 className="text-2xl font-bold mb-3">{t("contactoTitle")}</h3>
            <p className="text-white/90 mb-6">{t("contactoText")}</p>
            <Button asChild variant="secondary" className="bg-white text-[#0F9D58] hover:bg-white/90">
              <Link href="/contacto">
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("contactoLink")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
