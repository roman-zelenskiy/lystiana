"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { delivery } from "@/data/content";
import { FREE_SHIPPING_FROM } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icon";

const methodIcon: Record<string, IconName> = { warehouse: "box", postomat: "locker", courier: "courier" };
const stepIcon: IconName[] = ["pot", "box", "truck", "sprout"];

export function Delivery() {
  const reduce = useReducedMotion();
  return (
    <section id="dostavka" aria-labelledby="dostavka-title" className="relative py-20 md:py-28">
      <div className="wrap">
        <p className="hand -rotate-2 text-2xl text-coral-deep">від оранжереї до підвіконня</p>
        <h2 id="dostavka-title" className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-forest">
          Доставка та оплата
        </h2>

        {/* маршрут посилки: коробка «їде» вздовж пунктиру, коли секція з’являється */}
        <div className="relative mt-12">
          <div className="absolute top-8 right-[12%] left-[12%] hidden border-t-[3px] border-dashed border-moss md:block" aria-hidden="true" />
          {!reduce && <RouteBox />}
          <ol className="relative grid gap-6 md:grid-cols-4">
            {delivery.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4 md:flex-col md:items-center md:text-center">
                <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-milk text-forest shadow-[var(--shadow-sticker)] ${i === 3 ? "bg-coral" : "bg-sage"}`}>
                  <Icon name={stepIcon[i]} size={26} />
                </span>
                <span>
                  <span className="block text-lg font-black">
                    {i + 1}. {s.title}
                  </span>
                  <span className="mt-1 block text-muted md:mx-auto md:max-w-[15rem]">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[2.25rem] bg-cream p-6 shadow-[var(--shadow-card)] ring-1 ring-line/60 md:p-8">
            <h3 className="display text-2xl text-forest">Нова Пошта по всій Україні</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {delivery.methods.map((m) => (
                <li key={m.id} className="rounded-3xl bg-paper p-4">
                  <Icon name={methodIcon[m.id]} className="text-forest" />
                  <p className="mt-2 font-black">{m.title}</p>
                  <p className="text-sm text-muted">{m.time}</p>
                  <p className="mt-1 font-bold">{m.price}</p>
                  {"note" in m && <p className="mt-1 text-xs text-muted">{m.note}</p>}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-start gap-2 text-muted">
              <Icon name="sparkle" size={20} className="mt-0.5 shrink-0 text-coral-deep" />
              {delivery.winter}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[2.25rem] bg-coral p-6 text-ink md:p-8">
              <p className="hand text-2xl">а ще —</p>
              <p className="display mt-1 text-[clamp(1.6rem,3vw,2.3rem)] leading-tight">
                Безкоштовна доставка від {formatPrice(FREE_SHIPPING_FROM)}
              </p>
              <Icon name="truck" size={120} strokeWidth={1.2} className="absolute -right-4 -bottom-6 opacity-20" />
            </div>
            <div className="rounded-[2.25rem] bg-sage p-6 md:p-8">
              <h3 className="text-xl font-black">Оплата</h3>
              <ul className="mt-3 grid gap-2">
                {delivery.payment.map((p, i) => (
                  <li key={p} className="flex items-start gap-2">
                    <Icon name={i === 0 ? "card" : "cash"} size={20} className="mt-0.5 shrink-0 text-forest" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Коробка проїжджає маршрутом від першого кроку до останнього (лише transform) */
function RouteBox() {
  const track = useRef<HTMLDivElement>(null);
  const inView = useInView(track, { once: true, margin: "-120px" });
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    if (inView && track.current) setDistance(track.current.offsetWidth - 40);
  }, [inView]);
  return (
    <div ref={track} className="absolute top-3 right-[12%] left-[12%] hidden md:block" aria-hidden="true">
      <m.div
        className="grid h-10 w-10 place-items-center rounded-xl bg-butter text-ink shadow-[var(--shadow-sticker)]"
        initial={false}
        animate={distance ? { x: [0, distance], rotate: [0, -10, 8, -6, 0], opacity: [1, 1, 1, 0] } : undefined}
        transition={{ duration: 2.6, ease: [0.5, 0, 0.25, 1] }}
      >
        <Icon name="box" size={22} />
      </m.div>
    </div>
  );
}
