"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18n";
import { type LegalId } from "@/data/legal";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Modal } from "@/components/ui/Modal";

export function Footer() {
  const { meta, legal, site, t: ui } = useI18n();
  const { categories } = meta;
  const { nav, store } = site;
  const t = ui.footer;
  const [doc, setDoc] = useState<LegalId | null>(null);
  const [last, setLast] = useState<LegalId>("privacy");
  if (doc && doc !== last) setLast(doc);
  const shown = legal[doc ?? last];

  return (
    <footer className="on-dark relative mt-10 overflow-hidden rounded-t-[3rem] bg-forest-deep pt-16 pb-28 text-milk md:pb-12">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-block rounded-full bg-milk px-4 py-2">
              <Logo name={store.name} />
            </span>
            <p className="mt-4 max-w-xs text-milk/80">
              {t.about}
            </p>
            <ul className="mt-6 flex gap-2" aria-label={t.socials}>
              {[
                { href: store.instagram, icon: "instagram", label: "Instagram" },
                { href: store.telegram, icon: "telegram", label: "Telegram" },
                { href: store.tiktok, icon: "tiktok", label: "TikTok" },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.in(store.name, s.label)}
                    className="grid h-12 w-12 place-items-center rounded-full bg-milk/10 transition-transform duration-300 ease-[var(--ease-bounce)] hover:-rotate-12 hover:bg-butter hover:text-ink"
                  >
                    <Icon name={s.icon as "instagram" | "telegram" | "tiktok"} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label={t.sections}>
            <h2 className="hand text-2xl text-butter">{t.sections}</h2>
            <ul className="mt-3 grid gap-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-block py-1 hover:text-butter">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.catalogNav}>
            <h2 className="hand text-2xl text-butter">{t.catalog}</h2>
            <ul className="mt-3 grid gap-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`#kategoriia-${c.id}`} className="inline-block py-1 hover:text-butter">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="hand text-2xl text-butter">{t.contacts}</h2>
            <address className="mt-3 grid gap-2 not-italic">
              <a href={store.phoneHref} className="flex items-center gap-2 py-1 hover:text-butter">
                <Icon name="phone" size={18} /> {store.phone}
              </a>
              <a href={`mailto:${store.email}`} className="flex items-center gap-2 py-1 break-all hover:text-butter">
                <Icon name="mail" size={18} /> {store.email}
              </a>
              <span className="flex items-start gap-2 py-1">
                <Icon name="pin" size={18} className="mt-1 shrink-0" />
                <span>
                  {t.showroom(store.city, store.street)}
                  <br />
                  <span className="text-milk/70">{store.hours}</span>
                </span>
              </span>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/70">
          <p>{t.copy(store.name)}</p>
          <div className="flex flex-wrap gap-4">
            <button type="button" className="py-1 underline underline-offset-4 hover:text-butter" onClick={() => setDoc("privacy")}>
              {t.privacy}
            </button>
            <button type="button" className="py-1 underline underline-offset-4 hover:text-butter" onClick={() => setDoc("returns")}>
              {t.returns}
            </button>
          </div>
        </div>
      </div>

      <Modal open={!!doc} onClose={() => setDoc(null)} labelledBy="legal-title" className="sm:max-w-2xl">
        <div className="overflow-y-auto p-6 md:p-10">
          <h2 id="legal-title" className="display pr-12 text-3xl text-forest">
            {shown.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{t.updated(shown.updated)}</p>
          {shown.sections.map((s) => (
            <section key={s.h} className="mt-6">
              <h3 className="text-lg font-black">{s.h}</h3>
              <p className="mt-1.5 text-muted">{s.p}</p>
            </section>
          ))}
        </div>
      </Modal>
    </footer>
  );
}
