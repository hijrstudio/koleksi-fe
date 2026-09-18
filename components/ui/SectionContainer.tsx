import { ReactNode } from "react";
import clsx from "@/lib/clsx";
import PlusDivider from "@/components/ui/PlusDivider";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  /** Show the hairline side guides that frame the container (all white/body sections) */
  withGuides?: boolean;
  /** Also show a center vertical guide-line at 50% (2-column sections only) */
  centerGuide?: boolean;
  /** Show the diagonal-hatch ornament along the side margins (only some sections in the design) */
  withOrnament?: boolean;
  /** Show a green 40x40 "+" divider row at the top edge of the section */
  topDivider?: boolean;
  /** Also add a center "+" mark to the top divider (WelcomeStats -> PanduanPraktis boundary) */
  topDividerCenter?: boolean;
  /** Background variant */
  variant?: "white" | "muted" | "transparent";
  id?: string;
}

export default function SectionContainer({
  children,
  className,
  withGuides = false,
  centerGuide = false,
  withOrnament = false,
  topDivider = false,
  topDividerCenter = false,
  variant = "white",
  id,
}: SectionContainerProps) {
  const bg =
    variant === "white"
      ? "bg-surface-light dark:bg-surface-dark"
      : variant === "muted"
        ? "bg-muted-light dark:bg-muted-dark"
        : "bg-transparent";

  return (
    <section
      id={id}
      className={clsx(
        "relative",
        bg,
        withOrnament && "section-ornament",
        className,
      )}
    >
      {withGuides && (
        <>
          <span
            className="guide-line hidden md:block"
            style={{ left: "var(--gutter)" }}
          />
          <span
            className="guide-line hidden md:block"
            style={{ right: "var(--gutter)" }}
          />
          <span className="section-divider-h block md:hidden" />
        </>
      )}
      {centerGuide && (
        <span className="guide-line hidden lg:block" style={{ left: "50%" }} />
      )}
      {topDivider && <PlusDivider center={topDividerCenter} />}
      <div
        className="relative z-10 mx-auto py-12 sm:py-16 px-6 xxl:px-0"
        style={{ maxWidth: "var(--content-max-w)" }}
      >
        {children}
      </div>
    </section>
  );
}
