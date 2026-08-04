import { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { isMobileDevice } from "@/lib/device";

type Props = {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  delay?: number;
  /** See ScrollReveal: `li` keeps list semantics when wrapping a list item. */
  as?: "div" | "li";
} & { [key: `data-${string}`]: string | number | undefined };

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
  as = "div",
  ...rest
}: Props) {
  const mobile = await isMobileDevice();
  if (mobile) {
    // Mobile skips the animation wrapper, but the tag still has to be rendered
    // when it carries meaning (a list item) or styling.
    if (as === "li") {
      return (
        <li className={className} {...rest}>
          {children}
        </li>
      );
    }
    if (className) return <div className={className}>{children}</div>;
    return <>{children}</>;
  }
  return (
    <ScrollReveal className={className} animation={animation} delay={delay} as={as} {...rest}>
      {children}
    </ScrollReveal>
  );
}
