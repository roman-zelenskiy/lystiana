"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/I18n";
import { Icon } from "./Icon";

export type ComboOption = { id: string; label: string; hint?: string };

type Props = {
  id: string;
  label: string;
  options: ComboOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  emptyText?: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[’ʼ'`.,№]/g, "").replace(/\s+/g, " ").trim();

/** Поле з пошуком і списком варіантів (ARIA combobox + listbox) */
export function Combobox({ id, label, options, value, onChange, placeholder, error, disabled, emptyText: emptyProp }: Props) {
  const { t } = useI18n();
  const emptyText = emptyProp ?? t.catalog.nothing;
  const selected = options.find((o) => o.id === value) ?? null;
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // якщо вибір змінився ззовні (напр. скинули місто) — оновлюємо текст поля
  const [prevSelected, setPrevSelected] = useState(selected);
  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setQuery(selected?.label ?? "");
  }

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q || (selected && query === selected.label)) return options.slice(0, 50);
    return options.filter((o) => norm(`${o.label} ${o.hint ?? ""}`).includes(q)).slice(0, 50);
  }, [options, query, selected]);

  const pick = (o: ComboOption) => {
    onChange(o.id);
    setQuery(o.label);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${id}-o-${active}` : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          className="field pr-10"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
            if (selected) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(filtered.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter" && open && filtered[active]) {
              e.preventDefault();
              pick(filtered[active]);
            } else if (e.key === "Escape" && open) {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
            }
          }}
        />
        <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted" />
      </div>
      {open && !disabled && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto rounded-2xl bg-cream p-1.5 shadow-[var(--shadow-card)] ring-1 ring-line"
        >
          {filtered.length === 0 && <li className="p-3 text-muted">{emptyText}</li>}
          {filtered.map((o, i) => (
            <li
              key={o.id}
              id={`${id}-o-${i}`}
              role="option"
              aria-selected={o.id === value}
              className={`cursor-pointer rounded-xl px-3 py-2 ${i === active ? "bg-sage" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(o)}
            >
              <span className="block font-bold">{o.label}</span>
              {o.hint && <span className="block text-sm text-muted">{o.hint}</span>}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id={`${id}-error`} className="error">
          {error}
        </p>
      )}
    </div>
  );
}
