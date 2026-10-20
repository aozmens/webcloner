// Temporary wordmark until the official Teknosem logo file is supplied.
// Every logo placement (preloader, header, footer) renders this component, so swapping it is a one-file change.

export function TeknosemLogo({ className }: { className?: string }) {
  return (
    <span className={className ? `brand-logo ${className}` : "brand-logo"} role="img" aria-label="Teknosem">
      TEKNOSEM
    </span>
  );
}
