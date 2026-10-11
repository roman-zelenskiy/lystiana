import { useId, type SVGProps } from "react";

/** Ілюстровані листки для колажу. Точка кріплення (черешок) — внизу по центру. */

export function MonsteraLeaf(props: SVGProps<SVGSVGElement>) {
  const id = useId();
  // прорізи: клини від краю до середини листка — справжні «дірки» через mask
  const slits = [
    "M3 44 47 56 5 54Z",
    "M8 76 49 70 14 86Z",
    "M18 20 52 46 28 15Z",
    "M117 44 73 56 115 54Z",
    "M112 76 71 70 106 86Z",
    "M102 20 68 46 92 15Z",
  ];
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true" {...props}>
      <defs>
        <mask id={id}>
          <path d="M60 104C30 104 6 86 4 56 2 30 22 8 52 6c4 0 6 4 8 8 2-4 4-8 8-8 30 2 50 24 48 50-2 30-26 48-56 48Z" fill="#fff" />
          {slits.map((d) => (
            <path key={d} d={d} fill="#000" />
          ))}
          <ellipse cx="40" cy="64" rx="5" ry="2.6" transform="rotate(-20 40 64)" fill="#000" />
          <ellipse cx="80" cy="64" rx="5" ry="2.6" transform="rotate(20 80 64)" fill="#000" />
          <ellipse cx="44" cy="34" rx="4" ry="2.2" transform="rotate(-40 44 34)" fill="#000" />
          <ellipse cx="76" cy="34" rx="4" ry="2.2" transform="rotate(40 76 34)" fill="#000" />
        </mask>
      </defs>
      <path d="M60 148c0-14 1-30 0-46" stroke="var(--color-forest)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect width="120" height="110" fill="var(--color-forest)" mask={`url(#${id})`} />
      <path d="M60 102C59 70 60 40 60 14" stroke="var(--color-moss)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FernFrond(props: SVGProps<SVGSVGElement>) {
  const pinnae = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg viewBox="0 0 80 170" aria-hidden="true" {...props}>
      <path d="M40 168C40 120 44 60 40 6" stroke="var(--color-forest)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {pinnae.map((i) => {
        const y = 150 - i * 16;
        const len = 30 - i * 2.4;
        return (
          <g key={i} fill="var(--color-moss)">
            <ellipse cx={40 - len / 2} cy={y} rx={len / 2} ry={4.5} transform={`rotate(-24 ${40 - len / 2} ${y})`} />
            <ellipse cx={40 + len / 2} cy={y - 4} rx={len / 2} ry={4.5} transform={`rotate(24 ${40 + len / 2} ${y - 4})`} />
          </g>
        );
      })}
    </svg>
  );
}

export function CoinLeaves(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 110 120" aria-hidden="true" {...props}>
      <path d="M55 118C55 90 30 70 22 40M55 118C55 80 80 66 88 30M55 118V24" stroke="var(--color-forest)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="34" r="16" fill="var(--color-moss)" />
      <circle cx="88" cy="26" r="17" fill="var(--color-forest)" />
      <circle cx="55" cy="18" r="15" fill="var(--color-moss)" />
      <circle cx="22" cy="34" r="2.5" fill="var(--color-forest)" />
      <circle cx="88" cy="26" r="2.5" fill="var(--color-moss)" />
      <circle cx="55" cy="18" r="2.5" fill="var(--color-forest)" />
    </svg>
  );
}

export function BladeLeaves(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 170" aria-hidden="true" {...props}>
      <path d="M44 168C30 120 22 60 30 4c12 50 18 110 14 164Z" fill="var(--color-forest)" />
      <path d="M48 168C60 126 74 80 80 30c-20 40-30 92-32 138Z" fill="var(--color-moss)" />
      <path d="M40 168C30 140 12 110 6 76c22 22 32 56 34 92Z" fill="var(--color-moss)" />
      <path d="M36 150c-4-40-4-90 0-130" stroke="var(--color-butter)" strokeWidth="2" strokeDasharray="6 10" fill="none" />
    </svg>
  );
}

/** Невеликий листок для конфеті й декору */
export function LittleLeaf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 20C4 10 10 4 21 3c0 10-6 17-15 17H4Z" fill="currentColor" />
      <path d="M4 20c3.5-4.5 7-7.5 11-10" stroke="rgb(0 0 0 / .18)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
