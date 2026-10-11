"use client";

import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { useMemo, type ReactNode } from "react";
import { lightHint, lightLabel, rooms } from "@/data/catalog-meta";
import { photo } from "@/data/photos";
import { products } from "@/data/products";
import type { Light, RoomId } from "@/data/types";
import { matches, sortProducts } from "@/lib/filter";
import { plural } from "@/lib/format";
import { defaultFilters, useCatalog } from "@/store/catalog";
import { Icon } from "@/components/ui/Icon";

const lights: Light[] = ["shade", "diffused", "bright"];

/** Силуети меблів для ілюстрації кімнати */
const furniture: Record<RoomId, ReactNode> = {
  spalnia: (
    <g fill="var(--color-forest)">
      <rect x="170" y="196" width="200" height="44" rx="10" />
      <rect x="170" y="170" width="16" height="70" rx="6" />
      <rect x="190" y="180" width="58" height="24" rx="12" fill="var(--color-milk)" />
      <rect x="250" y="190" width="120" height="20" rx="8" fill="var(--color-coral)" />
    </g>
  ),
  kukhnia: (
    <g>
      <rect x="160" y="190" width="220" height="50" rx="6" fill="var(--color-forest)" />
      <rect x="150" y="182" width="240" height="12" rx="4" fill="var(--color-paper)" />
      <rect x="200" y="200" width="40" height="30" rx="4" fill="var(--color-moss)" />
      <rect x="300" y="200" width="40" height="30" rx="4" fill="var(--color-moss)" />
      <path d="M318 182v-22a10 10 0 0 1 20 0" stroke="var(--color-ink)" strokeWidth="4" fill="none" />
    </g>
  ),
  vitalnia: (
    <g fill="var(--color-forest)">
      <rect x="170" y="186" width="200" height="40" rx="18" />
      <rect x="160" y="200" width="30" height="40" rx="12" />
      <rect x="350" y="200" width="30" height="40" rx="12" />
      <rect x="190" y="174" width="160" height="26" rx="12" fill="var(--color-coral)" />
      <rect x="180" y="226" width="8" height="14" />
      <rect x="352" y="226" width="8" height="14" />
    </g>
  ),
  ofis: (
    <g>
      <rect x="170" y="180" width="190" height="10" rx="4" fill="var(--color-forest)" />
      <rect x="180" y="190" width="8" height="50" fill="var(--color-forest)" />
      <rect x="342" y="190" width="8" height="50" fill="var(--color-forest)" />
      <rect x="230" y="138" width="80" height="44" rx="6" fill="var(--color-ink)" />
      <rect x="236" y="144" width="68" height="32" rx="3" fill="var(--color-butter)" />
      <rect x="264" y="182" width="12" height="4" fill="var(--color-ink)" />
    </g>
  ),
  vanna: (
    <g>
      <path d="M160 188h220v18a34 34 0 0 1-34 34H194a34 34 0 0 1-34-34v-18Z" fill="var(--color-milk)" stroke="var(--color-forest)" strokeWidth="5" />
      <path d="M180 188v-50a14 14 0 0 1 28 0" stroke="var(--color-forest)" strokeWidth="5" fill="none" />
      <circle cx="260" cy="176" r="8" fill="var(--color-sage)" />
      <circle cx="282" cy="170" r="6" fill="var(--color-sage)" />
    </g>
  ),
};

export function RoomPicker() {
  const room = useCatalog((s) => s.room);
  const light = useCatalog((s) => s.light);
  const set = useCatalog((s) => s.set);
  const activeRoom = room ?? "vitalnia";
  const activeLight = light === "all" ? "diffused" : light;

  const picks = useMemo(
    () =>
      sortProducts(
        products.filter(
          (p) =>
            p.kind === "plant" &&
            matches(p, { ...defaultFilters, room: activeRoom, light: activeLight }),
        ),
        "popular",
      ),
    [activeRoom, activeLight],
  );

  // будь-який вибір одразу фільтрує каталог нижче
  const choose = (patch: { room?: RoomId; light?: Light }) =>
    set({ room: patch.room ?? activeRoom, light: patch.light ?? activeLight, category: "all", query: "" });

  const rayOpacity = { shade: 0.06, diffused: 0.3, bright: 0.62 }[activeLight];

  return (
    <section id="kimnata" aria-labelledby="kimnata-title" className="relative py-20 md:py-28">
      <div className="wrap">
        <div className="rounded-[2.5rem] bg-sage px-5 py-10 md:px-12 md:py-14">
          <p className="hand -rotate-2 text-2xl text-forest">тест на 10 секунд</p>
          <h2 id="kimnata-title" className="display mt-1 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] text-forest">
            Яка рослина для твоєї кімнати?
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="grid gap-8 lg:pt-6">
              <fieldset>
                <legend className="mb-3 font-extrabold">1. Де житиме рослина</legend>
                <div className="flex flex-wrap gap-2">
                  {rooms.map((r) => (
                    <label key={r.id} className="chip cursor-pointer text-base">
                      <input type="radio" name="room" className="sr-only" checked={activeRoom === r.id} onChange={() => choose({ room: r.id })} />
                      {r.label}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted">{rooms.find((r) => r.id === activeRoom)?.note}</p>
              </fieldset>

              <fieldset>
                <legend className="mb-3 font-extrabold">2. Скільки там світла</legend>
                <div className="grid grid-cols-3 gap-2">
                  {lights.map((l) => (
                    <label key={l} className="light-card">
                      <input type="radio" name="light" className="sr-only" checked={activeLight === l} onChange={() => choose({ light: l })} />
                      <Icon name={l === "bright" ? "sun" : l === "diffused" ? "diffused" : "shade"} size={26} />
                      <span className="font-extrabold">{lightLabel[l]}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted">{lightHint[activeLight]}</p>
              </fieldset>
            </div>

            {/* Ілюстрація кімнати: світло з вікна і меблі змінюються під вибір */}
            <div className="relative">
              <svg viewBox="0 0 400 260" className="w-full overflow-visible rounded-[2rem] bg-cream" role="img" aria-label={`Кімната: ${rooms.find((r) => r.id === activeRoom)?.label.toLowerCase()}, світло: ${lightLabel[activeLight].toLowerCase()}`}>
                <rect x="0" y="240" width="400" height="20" fill="var(--color-paper)" />
                {/* вікно */}
                <rect x="34" y="30" width="96" height="120" rx="48" fill={activeLight === "shade" ? "#cfdbe3" : "#ffeebb"} className="transition-colors duration-700" />
                <m.circle
                  cx="96"
                  r="16"
                  fill={activeLight === "bright" ? "var(--color-butter)" : "#ffffff"}
                  animate={{ cy: activeLight === "bright" ? 64 : activeLight === "diffused" ? 88 : 140, opacity: activeLight === "shade" ? 0 : 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                />
                <path d="M82 30v120M34 90h96" stroke="var(--color-forest)" strokeWidth="5" />
                <rect x="34" y="30" width="96" height="120" rx="48" fill="none" stroke="var(--color-forest)" strokeWidth="6" />
                {/* промені */}
                <m.path
                  d="M40 150 130 150 300 240 120 240Z"
                  fill="var(--color-butter)"
                  animate={{ opacity: rayOpacity }}
                  transition={{ duration: 0.6 }}
                />
                <AnimatePresence mode="popLayout">
                  <m.g
                    key={activeRoom}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ originX: "270px", originY: "240px" }}
                  >
                    {furniture[activeRoom]}
                  </m.g>
                </AnimatePresence>
                {/* рослина в горщику: в тіні — нижча, на сонці — пишніша */}
                <m.g animate={{ scale: activeLight === "shade" ? 0.85 : activeLight === "bright" ? 1.12 : 1 }} style={{ originX: "122px", originY: "240px" }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                  <path d="M122 200c-4-30-22-40-34-44 4 18 16 34 34 44Z" fill="var(--color-moss)" />
                  <path d="M122 200c2-34 18-48 32-52-2 22-14 40-32 52Z" fill="var(--color-forest)" />
                  <path d="M122 204c-1-26 2-46 8-62 8 20 4 44-8 62Z" fill="var(--color-moss)" />
                  <path d="M102 200h40l-5 40h-30Z" fill="var(--color-coral)" />
                </m.g>
              </svg>

              <div className="relative -mt-8 ml-auto w-[92%] rounded-[1.75rem] bg-cream p-4 shadow-[var(--shadow-card)] md:p-5">
                <p className="font-extrabold" aria-live="polite">
                  Підібрали {picks.length} {plural(picks.length, ["рослину", "рослини", "рослин"])}
                </p>
                <ul className="mt-3 flex gap-2" aria-label="Перші з підібраних рослин">
                  {picks.slice(0, 4).map((p, i) => (
                    <li key={p.id} className={`relative h-14 w-14 overflow-hidden rounded-2xl border-[3px] border-white shadow-[var(--shadow-sticker)] ${i % 2 ? "rotate-3" : "-rotate-3"}`}>
                      <Image src={photo(p.photos[0])} alt={p.name} fill sizes="56px" className="object-cover" />
                    </li>
                  ))}
                </ul>
                <a href="#katalog" onClick={() => choose({})} className="btn btn-forest mt-4 w-full">
                  Показати в каталозі <Icon name="arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
