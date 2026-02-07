"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Clock, Users, MapPin, Shield, Award, Headphones } from "lucide-react";

export default function WhyUs() {
  const t = useTranslations("whyUs");

  const reasons = [
    { icon: Clock, title: t("reason1Title"), description: t("reason1Desc") },
    { icon: Users, title: t("reason2Title"), description: t("reason2Desc") },
    { icon: MapPin, title: t("reason3Title"), description: t("reason3Desc") },
    { icon: Shield, title: t("reason4Title"), description: t("reason4Desc") },
    { icon: Award, title: t("reason5Title"), description: t("reason5Desc") },
    { icon: Headphones, title: t("reason6Title"), description: t("reason6Desc") },
  ];

  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-[#1e3a5f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7BC043] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header with Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("title")} <span className="text-[#7BC043]">{t("titleHighlight")}</span>?
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80"
                alt="Professional HVAC technician at work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/70 to-transparent" />
            </div>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#7BC043] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <reason.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#7BC043] mb-2">+800</p>
            <p className="text-white/70">{t("stat1")}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#7BC043] mb-2">5+</p>
            <p className="text-white/70">{t("stat2")}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#7BC043] mb-2">24/7</p>
            <p className="text-white/70">{t("stat3")}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#7BC043] mb-2">100%</p>
            <p className="text-white/70">{t("stat4")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
