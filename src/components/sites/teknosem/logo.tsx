// Official Teknosem logo (files supplied by the client, prepared by scripts/teknosem/build-logos.mjs).
// "dark" = white logo for dark backgrounds (the whole site today); "light" = colour logo for light backgrounds.
// Every logo placement (preloader, header, footer) renders this component.

import logoJson from "./content/logo.json";
import { withBase } from "./site-config";

export type LogoVariant = "dark" | "light";

const logos = logoJson as Record<LogoVariant, { src: string; width: number; height: number }>;

export function TeknosemLogo({ variant = "dark", className, eager }: { variant?: LogoVariant; className?: string; eager?: boolean }) {
  const logo = logos[variant];
  return (
    <img
      src={withBase(logo.src)}
      width={logo.width}
      height={logo.height}
      alt="Teknosem"
      className={className ? `brand-logo ${className}` : "brand-logo"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
    />
  );
}
