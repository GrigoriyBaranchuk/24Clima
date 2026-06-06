import ProblemsLeadButton from "@/components/ProblemsLeadButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWhatsAppLink } from "@/lib/constants";
import {
  AlertTriangle,
  Droplet,
  Power,
  Thermometer,
  Volume2,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Problems() {
  const t = await getTranslations("problems");
  const tCommon = await getTranslations("common");
  const tWhatsapp = await getTranslations("whatsappMessages");

  const problems = [
    {
      icon: Thermometer,
      key: "notCooling",
      title: t("notCooling.title"),
      description: t("notCooling.description"),
      causes: [
        t("notCooling.cause1"),
        t("notCooling.cause2"),
        t("notCooling.cause3"),
        t("notCooling.cause4"),
      ],
      solution: t("notCooling.solution"),
    },
    {
      icon: Droplet,
      key: "leaking",
      title: t("leaking.title"),
      description: t("leaking.description"),
      causes: [
        t("leaking.cause1"),
        t("leaking.cause2"),
        t("leaking.cause3"),
        t("leaking.cause4"),
      ],
      solution: t("leaking.solution"),
    },
    {
      icon: Volume2,
      key: "noisy",
      title: t("noisy.title"),
      description: t("noisy.description"),
      causes: [
        t("noisy.cause1"),
        t("noisy.cause2"),
        t("noisy.cause3"),
        t("noisy.cause4"),
      ],
      solution: t("noisy.solution"),
    },
    {
      icon: Power,
      key: "notTurningOn",
      title: t("notTurningOn.title"),
      description: t("notTurningOn.description"),
      causes: [
        t("notTurningOn.cause1"),
        t("notTurningOn.cause2"),
        t("notTurningOn.cause3"),
        t("notTurningOn.cause4"),
      ],
      solution: t("notTurningOn.solution"),
    },
  ];

  return (
    <section
      id="problemas"
      className="py-10 lg:py-28 section-gradient-alt scroll-mt-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="w-full max-w-3xl mx-auto text-center mb-6 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 lg:py-2 rounded-full mb-3 lg:mb-6">
            <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="font-medium text-xs lg:text-base">
              {t("badge")}
            </span>
          </div>
          <h2
            className="text-xl lg:text-5xl font-semibold text-[#1e3a5f] mb-2 lg:mb-6"
            style={{ letterSpacing: "-0.2px" }}
          >
            {t("title")}
          </h2>
          <p className="text-[13px] lg:text-lg text-gray-600 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {problems.map((problem, index) => (
            <Card
              key={index}
              className="card-hover border border-gray-100 shadow-md overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <problem.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[#1e3a5f] mb-2">
                      {problem.title}
                    </CardTitle>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-[#1e3a5f] mb-3">
                    {t("possibleCauses")}
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {problem.causes.map((cause, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-base text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-[#0F9D58] mb-2 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t("ourSolution")}
                  </h4>
                  <p className="text-base text-gray-700">{problem.solution}</p>
                </div>
                <ProblemsLeadButton
                  href={getWhatsAppLink(problem.title)}
                  className="w-full bg-[#1e3a5f] hover:bg-[#0d2240] text-white"
                >
                  {tCommon("requestDiagnosis")}
                </ProblemsLeadButton>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info — flex col for Safari centering */}
        <div className="mt-8 lg:mt-16 flex flex-col items-center text-center">
          <p className="text-gray-600 mb-4">{t("notInList")}</p>
          <ProblemsLeadButton
            href={getWhatsAppLink(tWhatsapp("problemIntro"))}
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold"
          >
            {t("describeByWhatsApp")}
          </ProblemsLeadButton>
        </div>
      </div>
    </section>
  );
}
