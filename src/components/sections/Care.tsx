"use client";

import { m, useReducedMotion } from "motion/react";
import { useI18n } from "@/components/I18n";
import { GUARANTEE_DAYS } from "@/data/site";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Стадія паростка за днем: насінина → паросток → листки → рослина */
function Sprout({ day }: { day: number }) {
  const stage = day < 3 ? 0 : day < 7 ? 1 : day < 12 ? 2 : 3;
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <path d="M8 30h24l-3 8H11Z" fill="var(--color-coral)" />
      {stage === 0 && <ellipse cx="20" cy="28" rx="4" ry="3" fill="#8f5f33" />}
      {stage >= 1 && <path d={`M20 30V${stage === 1 ? 22 : stage === 2 ? 16 : 10}`} stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />}
      {stage >= 1 && <path d="M20 24c0-4-3-6-6-6 0 4 3 6 6 6Z" fill="var(--color-moss)" />}
      {stage >= 2 && <path d="M20 20c0-4 3-7 7-7 0 4-3 7-7 7Z" fill="var(--color-moss)" />}
      {stage >= 3 && (
        <>
          <path d="M20 14c0-4-3-7-7-7 0 4 3 7 7 7Z" fill="var(--color-forest)" />
          <circle cx="20" cy="8" r="3.5" fill="var(--color-butter)" />
        </>
      )}
    </svg>
  );
}

export function Care() {
  const { content, site, t: ui } = useI18n();
  const { careTips, guaranteeDiary } = content;
  const { store } = site;
  const tc = ui.care;
  const reduce = useReducedMotion();
  const days = Array.from({ length: GUARANTEE_DAYS }, (_, i) => i + 1);
  const notes = new Map<number, string>(guaranteeDiary.map((d) => [d.day, d.text]));

  return (
    <section id="dohliad" aria-labelledby="dohliad-title" className="relative py-20 md:py-28">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="hand -rotate-2 text-2xl text-coral-deep">{tc.note}</p>
            <h2 id="dohliad-title" className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-forest">
              {tc.title}
            </h2>
            <p className="mt-4 max-w-lg text-lg text-muted">
              {tc.lead}
            </p>
            <a href={store.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-forest mt-6">
              <Icon name="telegram" size={20} /> {tc.ask}
            </a>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {careTips.map((t, i) => (
              <m.li
                key={t.title}
                className="rounded-[2rem] bg-cream p-5 shadow-[var(--shadow-card)] ring-1 ring-line/60"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.06 }}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${i % 2 ? "bg-butter" : "bg-sage"} text-forest`}>
                  <Icon name={t.icon as IconName} className={t.icon === "drop" ? "care-drop" : t.icon === "sun" ? "care-sun" : ""} />
                </span>
                <h3 className="mt-4 text-lg font-black">{t.title}</h3>
                <p className="mt-1.5 text-muted">{t.text}</p>
              </m.li>
            ))}
          </ul>
        </div>

        {/* Щоденник гарантії: 14 днів, за які насінина виростає в рослину */}
        <div className="mt-16 rounded-[2.5rem] bg-forest p-6 text-milk md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="display text-[clamp(1.6rem,3.4vw,2.6rem)]">
              {tc.guaranteeA} <span className="text-butter">{tc.guaranteeB(GUARANTEE_DAYS)}</span>
            </h3>
            <p className="max-w-md text-milk/80">
              {tc.guaranteeText}
            </p>
          </div>
          <ol className="mt-8 grid grid-cols-7 gap-2 md:grid-cols-14">
            {days.map((d, i) => {
              const note = notes.get(d);
              return (
                <m.li
                  key={d}
                  className={`relative flex flex-col items-center rounded-2xl py-2 ${note ? "bg-milk text-ink" : "bg-forest-deep"}`}
                  initial={reduce ? false : { opacity: 0, scaleY: 0.3 }}
                  whileInView={{ opacity: 1, scaleY: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.05 }}
                  style={{ originY: 1 }}
                >
                  <Sprout day={d} />
                  <span className="text-xs font-black">
                    <span className="sr-only">{tc.daySr}</span>
                    {d}
                  </span>
                  {note && <span className="sr-only">: {note}</span>}
                </m.li>
              );
            })}
          </ol>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {guaranteeDiary.map((d) => (
              <li key={d.day} className="flex gap-3">
                <span className="hand shrink-0 text-2xl leading-none text-butter">{tc.day(d.day)}</span>
                <span className="text-sm text-milk/85">{d.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
