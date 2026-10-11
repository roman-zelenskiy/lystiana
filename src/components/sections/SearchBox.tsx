"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { products } from "@/data/products";
import { photo } from "@/data/photos";
import { formatPrice } from "@/lib/format";
import { fromPrice, matchesQuery } from "@/lib/filter";
import { useCatalog } from "@/store/catalog";
import { Icon } from "@/components/ui/Icon";

/**
 * Пошук по каталогу (combobox): підказки з фото, стрілки ↑↓, Enter відкриває швидкий перегляд,
 * а Enter без вибраної підказки застосовує пошук до каталогу.
 */
export function SearchBox({ onDone, autoFocus = false }: { onDone?: () => void; autoFocus?: boolean }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const setFilters = useCatalog((s) => s.set);
  const openQuickView = useCatalog((s) => s.openQuickView);

  const results = useMemo(
    () => (value.trim().length < 2 ? [] : products.filter((p) => matchesQuery(p, value)).slice(0, 5)),
    [value],
  );
  const expanded = open && value.trim().length >= 2;

  function applyToCatalog() {
    setFilters({ query: value.trim(), category: "all" });
    setOpen(false);
    onDone?.();
    document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function pick(productId: string) {
    setOpen(false);
    setValue("");
    onDone?.();
    openQuickView(productId);
  }

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (active >= 0 && results[active]) pick(results[active].id);
        else applyToCatalog();
      }}
    >
      <label htmlFor={`${id}-q`} className="sr-only">
        Пошук рослин
      </label>
      <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
      <input
        id={`${id}-q`}
        type="search"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined}
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder="Монстера, кашпо, для котів…"
        className="field !min-h-11 !rounded-full !py-2 pr-4 pl-11"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(results.length - 1, i + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(-1, i - 1));
          } else if (e.key === "Escape" && expanded) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }
        }}
      />
      {expanded && (
        <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-3xl bg-cream p-2 shadow-[var(--shadow-card)] ring-1 ring-line">
          <ul id={`${id}-list`} role="listbox" aria-label="Підказки пошуку">
            {results.map((p, i) => (
              <li
                key={p.id}
                id={`${id}-o${i}`}
                role="option"
                aria-selected={i === active}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl p-2 ${i === active ? "bg-sage" : "hover:bg-paper"}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(p.id)}
              >
                <Image
                  src={photo(p.photos[0])}
                  alt=""
                  width={44}
                  height={44}
                  sizes="44px"
                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold">{p.name}</span>
                  <span className="block text-sm text-muted">від {formatPrice(fromPrice(p))}</span>
                </span>
              </li>
            ))}
          </ul>
          {results.length === 0 ? (
            <p className="p-3 text-muted">Нічого не знайшли — спробуйте «монстера» або «кашпо».</p>
          ) : (
            <button type="submit" className="mt-1 w-full rounded-2xl p-3 text-left font-extrabold text-forest hover:bg-paper">
              Показати всі результати в каталозі →
            </button>
          )}
        </div>
      )}
    </form>
  );
}
