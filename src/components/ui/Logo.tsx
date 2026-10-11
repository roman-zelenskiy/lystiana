/** Логотип: листок-крапля з прожилкою і назва з легким нахилом */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0 -rotate-12">
        <path d="M20 3c11 5 16 14 15 22-1 7-7 12-15 12S6 32 5 25C4 17 9 8 20 3Z" fill="var(--color-moss)" />
        <path d="M20 9v24M20 18l-6-4M20 24l7-5M20 29l-5-3" stroke="var(--color-forest)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="31" cy="9" r="4" fill="var(--color-coral)" />
      </svg>
      <span className="display text-[1.45rem] leading-none text-forest">Листяна</span>
    </span>
  );
}
