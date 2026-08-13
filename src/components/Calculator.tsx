import { isMobileDevice } from "@/lib/device";
import CalculatorMobile from "./CalculatorMobile";
import CalculatorDesktop from "./CalculatorDesktop";

/**
 * Server orchestrator for the price calculator.
 *
 * Real mobile UA (iPhone, Android) → only CalculatorMobile (perf win).
 *
 * Desktop UA → both rendered, CSS picks one by viewport breakpoint:
 *   - viewport < lg (e.g. DevTools mobile mode, narrow window) → mobile card
 *   - viewport ≥ lg → desktop panel
 *
 * This way real mobile users get the smaller bundle, while desktop users
 * who shrink their window or open DevTools mobile preview still see the
 * correct mobile UI.
 *
 * id="calculadora" lives ONLY here, on the always-visible wrapper: the two
 * variants used to carry it on their <section>, which on desktop UA produced
 * a duplicate id whose first DOM match was display:none — anchor links
 * (#calculadora from Hero, CleaningPackages, service pages) silently no-oped.
 */
export default async function Calculator() {
  const mobile = await isMobileDevice();
  if (mobile) {
    return (
      <div id="calculadora" className="scroll-mt-20">
        <CalculatorMobile />
      </div>
    );
  }
  return (
    <div id="calculadora" className="scroll-mt-20">
      <div className="lg:hidden">
        <CalculatorMobile />
      </div>
      <div className="hidden lg:block">
        <CalculatorDesktop />
      </div>
    </div>
  );
}
