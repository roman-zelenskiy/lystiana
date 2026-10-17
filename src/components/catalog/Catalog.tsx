"use client";

import { m } from "motion/react";
import { categories as categoriesUk, type PriceRangeId, type SortId } from "@/data/catalog-meta";
import { Select } from "@/components/ui/Select";
import { useI18n } from "@/components/I18n";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { CategoryId, Difficulty, Light } from "@/data/types";
import { activeFilterCount, matches, sortProducts } from "@/lib/filter";
import { useCatalog } from "@/store/catalog";
import { useAnnounce } from "@/components/ui/announce";
import { Icon } from "@/components/ui/Icon";
import { ProductCard, ProductCardLight } from "./ProductCard";
import { EmptyState } from "./EmptyState";

/** Ідентифікатори вкладок не залежать від мови — потрібні для #kategoriia-… в адресі */
const tabIds: (CategoryId | "all")[] = ["all", ...categoriesUk.map((c) => c.id)];

/** Хеш виду #kategoriia-kashpo відкриває потрібну категорію (якорі з футера та пошуковиків) */
const HASH_PREFIX = "kategoriia-";

export function Catalog() {
  const { meta, products, t: ui } = useI18n();
  const { categories, priceRanges, rooms, sorts, lightLabel } = meta;
  const t = ui.catalog;
  const tabs: { id: CategoryId | "all"; label: string }[] = [{ id: "all", label: t.all }, ...categories];
  const f = useCatalog();
  const say = useAnnounce((s) => s.say);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sorted = useMemo(() => sortProducts(products, f.sort), [products, f.sort]);
  const matching = useMemo(() => sorted.filter((p) => matches(p, f)), [sorted, f]);
  const shownIds = useMemo(() => new Set(matching.slice(0, f.limit).map((p) => p.id)), [matching, f.limit]);
  const rest = matching.length - shownIds.size;
  const activeCount = activeFilterCount(f);

  // оголошуємо кількість знайденого після зміни фільтрів (не на першому рендері)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    say(matching.length ? t.found(matching.length) : t.nothing);
  }, [matching.length, say, t]);

  useEffect(() => {
    // ?q=… з пошуку Google (SearchAction у JSON-LD) підставляємо в пошук каталогу
    const q = new URLSearchParams(location.search).get("q");
    if (q) useCatalog.getState().set({ query: q.slice(0, 60) });
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h.startsWith(HASH_PREFIX)) return;
      const id = h.slice(HASH_PREFIX.length);
      if (tabIds.includes(id as CategoryId)) useCatalog.getState().set({ category: id as CategoryId });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onTabKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    f.set({ category: tabs[next].id });
    tabRefs.current[next]?.focus();
  };
  const activeTab = tabs.findIndex((t) => t.id === f.category);
  const categoryLead = categories.find((c) => c.id === f.category)?.lead;

  return (
    <section id="katalog" aria-labelledby="katalog-title" className="relative py-20 md:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="hand -rotate-2 text-2xl text-coral-deep">{t.note}</p>
            <h2 id="katalog-title" className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-forest">
              {t.title}
            </h2>
          </div>
          <p className="max-w-md text-muted">
            {t.lead}
          </p>
        </div>

        {/* ── Категорії ── */}
        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          <div role="tablist" aria-label={t.tabs} className="flex w-max gap-1 rounded-full bg-paper p-1.5">
            {tabs.map((t, i) => {
              const active = f.category === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`${HASH_PREFIX}${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls="katalog-grid"
                  tabIndex={active ? 0 : -1}
                  onKeyDown={(e) => onTabKey(e, i)}
                  onClick={() => f.set({ category: t.id })}
                  className={`relative rounded-full px-4 py-2.5 font-extrabold whitespace-nowrap transition-colors ${active ? "text-milk" : "text-ink hover:text-forest"}`}
                >
                  {active && (
                    // індикатор-«листок» перетікає до активної вкладки
                    <m.span
                      layoutId="tab-leaf"
                      className="absolute inset-0 rounded-[999px_999px_999px_0.6rem] bg-forest"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Фільтри ── */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="chip md:hidden"
            aria-expanded={filtersOpen}
            aria-controls="katalog-filters"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <Icon name="filter" size={18} /> {t.filters}{activeCount ? ` · ${activeCount}` : ""}
          </button>
          <Select
            id="katalog-sort"
            label={t.sort}
            className="ml-auto md:order-last"
            value={f.sort}
            onChange={(v) => f.set({ sort: v as SortId })}
            options={sorts}
          />

          <div id="katalog-filters" className={`${filtersOpen ? "grid" : "hidden"} w-full gap-3 md:flex md:w-auto md:flex-1 md:flex-wrap md:items-center`}>
            <Segmented
              label={t.light}
              value={f.light}
              onChange={(v) => f.set({ light: v })}
              options={[{ id: "all", label: t.anyLight }, ...(["shade", "diffused", "bright"] as Light[]).map((l) => ({ id: l, label: lightLabel[l] }))]}
            />
            <Select
              id="katalog-difficulty"
              label={t.difficulty}
              value={String(f.difficulty)}
              onChange={(v) => f.set({ difficulty: Number(v) as Difficulty })}
              options={[
                { id: "3", label: t.anyCare },
                { id: "1", label: t.easyOnly },
                { id: "2", label: t.easyMid },
              ]}
            />
            <Select
              id="katalog-price"
              label={t.price}
              value={f.price}
              onChange={(v) => f.set({ price: v as PriceRangeId })}
              options={priceRanges.map((r) => ({ id: r.id, label: r.label }))}
            />
            <button type="button" className="chip" aria-pressed={f.petSafe} onClick={() => f.set({ petSafe: !f.petSafe })}>
              <Icon name="paw" size={18} /> {t.pets}
            </button>
            <div className="relative md:w-56">
              <label htmlFor="katalog-q" className="sr-only">
                {t.searchLabel}
              </label>
              <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <input
                id="katalog-q"
                type="search"
                placeholder={t.searchPh}
                className="field !min-h-11 !rounded-full !py-2 pl-10"
                value={f.query}
                onChange={(e) => f.set({ query: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* активні умови, які прийшли з підбору кімнати чи пошуку */}
        {(f.room || activeCount > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {f.room && (
              <RemovableChip label={t.roomChip} removeLabel={t.removeChip} onRemove={() => f.set({ room: null })}>
                {t.roomIs(rooms.find((r) => r.id === f.room)?.label ?? "")}
              </RemovableChip>
            )}
            {f.query.trim() && <RemovableChip label={t.queryChip} removeLabel={t.removeChip} onRemove={() => f.set({ query: "" })}>{ui.q(f.query.trim())}</RemovableChip>}
            <button type="button" onClick={f.reset} className="ml-1 font-extrabold text-coral-deep underline underline-offset-4">
              {t.reset}
            </button>
          </div>
        )}

        <p className="mt-6 font-bold text-muted" aria-hidden="true">
          {categoryLead ? `${categoryLead} · ` : ""}
          {ui.items(matching.length)}
        </p>

        {/* Усі товари завжди є в HTML (для пошуковиків), невідповідні — приховані атрибутом hidden */}
        <div id="katalog-grid" role="tabpanel" aria-labelledby={`${HASH_PREFIX}${tabs[activeTab].id}`} className="mt-5">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sorted.map((p) => (
                <GridItem key={p.id} shown={shownIds.has(p.id)} light={<ProductCardLight product={p} />}>
                  <ProductCard product={p} />
                </GridItem>
              ))}
            </ul>
          {matching.length === 0 && <EmptyState onReset={f.reset} />}
        </div>

        {rest > 0 && (
          <div className="mt-12 flex justify-center">
            <button type="button" onClick={f.more} className="btn btn-ghost h-14 px-8 text-lg">
              <Icon name="sprout" /> {t.more(Math.min(rest, 12), rest)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

type Phase = "shown" | "entering" | "leaving" | "hidden";

/**
 * Картка в сітці. Нова — «виростає з горщика»: масштаб знизу вгору з пружинкою.
 * Зайва — «осідає» і ховається (лишаючись у HTML). Сусіди плавно перебудовуються (layout).
 * Прихована картка рендериться полегшеною (назва, опис, ціна, фото — для пошуковиків),
 * повна інтерактивна версія з’являється, коли картку показано: менше DOM і швидша гідратація.
 */
function GridItem({ shown, children, light }: { shown: boolean; children: ReactNode; light: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(shown ? "shown" : "hidden");
  const [prevShown, setPrevShown] = useState(shown);
  if (prevShown !== shown) {
    setPrevShown(shown);
    setPhase(shown ? "entering" : phase === "hidden" ? "hidden" : "leaving");
  }

  return (
    <m.li
      layout={phase === "hidden" ? false : "position"}
      hidden={phase === "hidden"}
      className="origin-bottom"
      initial={false}
      animate={
        phase === "leaving"
          ? { opacity: 0, scale: 0.82, y: 24 }
          : { opacity: 1, scale: 1, scaleY: 1, y: 0 }
      }
      {...(phase === "entering" && { initial: { opacity: 0, scale: 0.7, scaleY: 0.2, y: 30 } })}
      transition={
        phase === "leaving"
          ? { duration: 0.18, ease: "easeIn" }
          : { type: "spring", stiffness: 260, damping: 18, layout: { type: "spring", stiffness: 300, damping: 32 } }
      }
      onAnimationComplete={() => {
        if (phase === "leaving") setPhase("hidden");
        else if (phase === "entering") setPhase("shown");
      }}
    >
      {phase === "hidden" ? light : children}
    </m.li>
  );
}

function RemovableChip({
  children,
  label,
  removeLabel,
  onRemove,
}: {
  children: ReactNode;
  label: string;
  removeLabel: (l: string) => string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-butter py-1 pr-1 pl-3 font-bold">
      {children}
      <button type="button" onClick={onRemove} className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/10" aria-label={removeLabel(label)}>
        <Icon name="close" size={14} />
      </button>
    </span>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-1.5">
      <legend className="sr-only">{label}</legend>
      <span className="mr-1 text-sm font-extrabold text-muted" aria-hidden="true">
        {label}:
      </span>
      {options.map((o) => (
        <label key={o.id} className="chip cursor-pointer">
          <input type="radio" name={`seg-${label}`} className="sr-only" checked={value === o.id} onChange={() => onChange(o.id)} />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}
