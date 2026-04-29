import { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { isMobileDevice } from "@/lib/device";

type Props = {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  delay?: number;
};

/**
 * Server wrapper: ScrollReveal (IntersectionObserver-based) is loaded only
 * for desktop UA. On mobile (single-screen home) the children are rendered
 * raw — saves one client component + its hook from shipping in the bundle.
 */
export default async function RevealOnDesktop({
  children,
  className,
  animation,
  delay,
}: Props) {
  const mobile = await isMobileDevice();
  if (mobile) {
    if (className) return <div className={className}>{children}</div>;
    return <>{children}</>;
  }
  return (
    <ScrollReveal className={className} animation={animation} delay={delay}>
      {children}
    </ScrollReveal>
  );
}
