"use client";

import { m } from "motion/react";
import { useI18n } from "@/components/I18n";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function Faq() {
  const { content, site, t: ui } = useI18n();
  const { faq } = content;
  const { store } = site;
  const t = ui.faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-paper py-20 md:py-28">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="hand -rotate-2 text-2xl text-coral-deep">{t.note}</p>
          <h2 id="faq-title" className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-forest">
            {t.title}
          </h2>
          <p className="mt-4 max-w-sm text-muted">{t.lead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={store.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-forest">
              <Icon name="telegram" size={20} /> Telegram
            </a>
            <a href={store.phoneHref} className="btn btn-ghost">
              <Icon name="phone" size={20} /> {store.phone}
            </a>
          </div>
        </div>

          <ul className="grid gap-3">
            {faq.map((item, i) => {
              const expanded = open === i;
              return (
                <m.li layout="position" key={item.q} className="overflow-hidden rounded-[1.75rem] bg-cream ring-1 ring-line/70">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={expanded}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                      className="flex w-full items-center gap-4 p-5 text-left text-lg font-extrabold"
                    >
                      <span className="flex-1">{item.q}</span>
                      {/* листок-плюс: при відкритті розгортається в «мінус» */}
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-[999px_999px_999px_0.4rem] transition-[transform,background-color] duration-500 ease-[var(--ease-bounce)] ${expanded ? "rotate-[225deg] bg-forest text-milk" : "bg-sage text-forest"}`}
                        aria-hidden="true"
                      >
                        <Icon name="plus" size={20} />
                      </span>
                    </button>
                  </h3>
                  {/* відповідь завжди в HTML (для пошуковиків і FAQPage), закрита — hidden */}
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!expanded} className="faq-answer">
                    <p className="px-5 pb-5 text-muted">{item.a}</p>
                  </div>
                </m.li>
              );
            })}
          </ul>
      </div>
    </section>
  );
}
