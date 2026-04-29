"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Thermometer, Droplet, Volume2, Power, ChevronRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/constants";
import { metaPixelEvent } from "@/components/MetaPixel";
import { useState } from "react";

/**
 * Problems page content — dark app-like style for mobile,
 * reuses the same translation keys as the Problems section.
 */
export default function ProblemsContent() {
  const t = useTranslations("problems");
  const tCommon = useTranslations("common");
  const tWhatsapp = useTranslations("whatsappMessages");
  const [expanded, setExpanded] = useState<number | null>(null);

  const problems = [
    {
      icon: Thermometer,
      color: "from-red-500 to-red-600",
      title: t("notCooling.title"),
      description: t("notCooling.description"),
      causes: [t("notCooling.cause1"), t("notCooling.cause2"), t("notCooling.cause3"), t("notCooling.cause4")],
      solution: t("notCooling.solution"),
    },
    {
      icon: Droplet,
      color: "from-blue-500 to-blue-600",
      title: t("leaking.title"),
      description: t("leaking.description"),
      causes: [t("leaking.cause1"), t("leaking.cause2"), t("leaking.cause3"), t("leaking.cause4")],
      solution: t("leaking.solution"),
    },
    {
      icon: Volume2,
      color: "from-amber-500 to-amber-600",
      title: t("noisy.title"),
      description: t("noisy.description"),
      causes: [t("noisy.cause1"), t("noisy.cause2"), t("noisy.cause3"), t("noisy.cause4")],
      solution: t("noisy.solution"),
    },
    {
      icon: Power,
      color: "from-purple-500 to-purple-600",
      title: t("notTurningOn.title"),
      description: t("notTurningOn.description"),
      causes: [t("notTurningOn.cause1"), t("notTurningOn.cause2"), t("notTurningOn.cause3"), t("notTurningOn.cause4")],
      solution: t("notTurningOn.solution"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1b2a] lg:bg-transparent">
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-16">
        {/* Header */}
        <div className="mb-6 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full mb-3 lg:bg-red-50 lg:text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-xs">{t("badge")}</span>
          </div>
          <h1 className="text-2xl lg:text-5xl font-semibold text-white lg:text-[#1e3a5f] mb-2" style={{ letterSpacing: "-0.3px" }}>
            {t("title")}
          </h1>
          <p className="text-white/60 lg:text-gray-600 text-sm lg:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Problem Cards */}
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            const isExpanded = expanded === index;
            return (
              <div key={index}>
                {/* Mobile: collapsible dark card */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    className="w-full bg-[#162a3e] rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-[15px]">{problem.title}</p>
                      <p className="text-white/50 text-xs truncate">{problem.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-white/30 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="bg-[#162a3e] rounded-b-2xl -mt-2 pt-0 px-4 pb-4 animate-in slide-in-from-top-2">
                      <div className="border-t border-white/10 pt-3">
                        <p className="text-white/70 text-sm mb-3">{problem.description}</p>
                        <div className="mb-3">
                          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">{t("possibleCauses")}</p>
                          <ul className="space-y-1">
                            {problem.causes.map((cause, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-white/60 text-sm">
                                <div className="w-1 h-1 bg-red-400 rounded-full" />
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-[#7BC043]/10 rounded-xl p-3 mb-3">
                          <p className="text-[#7BC043] text-xs font-medium mb-1">{t("ourSolution")}</p>
                          <p className="text-white/70 text-sm">{problem.solution}</p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-full h-10 active:scale-95 transition-transform"
                        >
                          <a
                            href={getWhatsAppLink(problem.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => metaPixelEvent("Lead")}
                          >
                            {tCommon("requestDiagnosis")}
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop: full card (same as original Problems section style) */}
                <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-white p-6 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{problem.title}</h3>
                        <p className="text-gray-600 text-base leading-relaxed">{problem.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-4">
                    <div className="mb-6">
                      <h4 className="font-semibold text-[#1e3a5f] mb-3">{t("possibleCauses")}</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {problem.causes.map((cause, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-base text-gray-600">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-[#0F9D58] mb-2">{t("ourSolution")}</h4>
                      <p className="text-base text-gray-700">{problem.solution}</p>
                    </div>
                    <Button asChild className="w-full bg-[#1e3a5f] hover:bg-[#0d2240] text-white">
                      <a
                        href={getWhatsAppLink(problem.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => metaPixelEvent("Lead")}
                      >
                        {tCommon("requestDiagnosis")}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-white/50 lg:text-gray-600 text-sm mb-4">
            {t("notInList")}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-full lg:rounded-md active:scale-95 transition-transform"
          >
            <a
              href={getWhatsAppLink(tWhatsapp("problemIntro"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => metaPixelEvent("Lead")}
            >
              {t("describeByWhatsApp")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
