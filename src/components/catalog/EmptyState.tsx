"use client";

import { m } from "motion/react";

/** Порожній результат: горщик зі зніченим паростком, який «підбадьорюється» при наведенні на кнопку */
export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group mx-auto mt-4 flex max-w-md flex-col items-center rounded-[2.5rem] bg-paper px-6 py-12 text-center"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <ellipse cx="60" cy="108" rx="34" ry="5" fill="var(--color-line)" />
        <g className="origin-[60px_70px] -rotate-[28deg] transition-transform duration-500 ease-[var(--ease-bounce)] group-has-[button:hover]:rotate-0">
          <path d="M60 70V40" stroke="var(--color-forest)" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 48c0-9-7-16-16-16 0 9 7 16 16 16Z" fill="var(--color-moss)" />
          <path d="M60 42c0-7 6-13 13-13 0 7-6 13-13 13Z" fill="var(--color-moss)" />
        </g>
        <path d="M30 68h60l-7 36a5 5 0 0 1-5 4H42a5 5 0 0 1-5-4l-7-36Z" fill="var(--color-coral)" />
        <rect x="26" y="62" width="68" height="10" rx="5" fill="var(--color-coral-deep)" />
      </svg>
      <p className="display mt-4 text-2xl text-forest">Тут поки голо, як на підвіконні восени</p>
      <p className="mt-2 text-muted">За цими умовами нічого не знайшлося. Спробуйте прибрати частину фільтрів.</p>
      <button type="button" onClick={onReset} className="btn btn-forest mt-6">
        Скинути фільтри
      </button>
    </m.div>
  );
}
