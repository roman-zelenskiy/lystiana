"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";

type Option = { id: string; label: string };

/**
 * Стилізований select (combobox + listbox): такий самий «пігулковий» вигляд, як поля каталогу,
 * і клавіатура як у нативного — стрілки, Home/End, Enter/пробіл, Esc і пошук за першими літерами.
 */
export function Select({
  id,
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  className?: string;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const selected = Math.max(0, options.findIndex((o) => o.id === value));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${uid}-o${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, uid]);

  const show = () => {
    setActive(selected);
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].id);
    setOpen(false);
    button.current?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    const move = (i: number) => {
      e.preventDefault();
      if (!open) return show();
      setActive(Math.min(last, Math.max(0, i)));
    };
    switch (e.key) {
      case "ArrowDown":
        return move(active + 1);
      case "ArrowUp":
        return move(active - 1);
      case "Home":
        return move(0);
      case "End":
        return move(last);
      case "Enter":
      case " ":
        e.preventDefault();
        return open ? pick(active) : show();
      case "Escape":
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at > 700 ? "" : typed.current.text) + e.key.toLowerCase(), at: now };
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (i < 0) return;
      if (open) setActive(i);
      else onChange(options[i].id);
    }
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <span id={`${uid}-label`} className="sr-only">
        {label}
      </span>
      <button
        ref={button}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${uid}-label ${id}`}
        aria-activedescendant={open ? `${uid}-o${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className="field flex !min-h-11 w-full items-center justify-between gap-2 !rounded-full !py-2 pr-3 text-left font-bold"
      >
        <span className="truncate">{options[selected]?.label}</span>
        <Icon name="chevron" size={18} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${uid}-label`}
          tabIndex={-1}
          className="absolute top-[calc(100%+0.4rem)] right-0 z-30 max-h-72 min-w-full overflow-y-auto overscroll-contain rounded-3xl bg-cream p-1.5 shadow-[var(--shadow-card)] ring-1 ring-line"
        >
          {options.map((o, i) => (
            <li
              key={o.id}
              id={`${uid}-o${i}`}
              role="option"
              aria-selected={i === selected}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 whitespace-nowrap ${
                i === active ? "bg-sage" : ""
              } ${i === selected ? "font-extrabold text-forest" : "font-bold"}`}
            >
              {o.label}
              {i === selected && <Icon name="check" size={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
