"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  /** id заголовка всередині — для aria-labelledby */
  labelledBy: string;
  variant?: "center" | "side";
  className?: string;
  children: ReactNode;
  /** Кнопка закриття у верхньому куті */
  closeLabel?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const noop = () => () => {};

/** Скільки модалок відкрито зараз (корзина може відкрити оформлення поверх себе) */
let openCount = 0;

/**
 * Модальне вікно або бічна панель.
 * Фокус тримається всередині, Esc закриває, після закриття фокус повертається туди, звідки відкрили.
 * Решта сторінки отримує inert — недоступна ні мишею, ні клавіатурою, ні скрінрідеру.
 */
export function Modal({ open, onClose, labelledBy, variant = "center", className = "", children, closeLabel = "Закрити" }: Props) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const page = document.getElementById("page");
    openCount += 1;
    page?.setAttribute("inert", "");
    document.documentElement.classList.add("lock");

    // фокус на перший інтерактивний елемент (або на саму панель)
    const t = requestAnimationFrame(() => {
      const first = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current;
      first?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (!panel.current) return;
      // реагує лише верхня модалка
      const top = [...document.querySelectorAll<HTMLElement>("[data-modal]")].at(-1);
      if (top !== panel.current) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(t);
      document.removeEventListener("keydown", onKey);
      openCount -= 1;
      if (openCount === 0) {
        page?.removeAttribute("inert");
        document.documentElement.classList.remove("lock");
      }
      if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;

  const side = variant === "side";
  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : side
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : {
          initial: { opacity: 0, y: 40, scale: 0.94, rotate: -1.5 },
          animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
          exit: { opacity: 0, y: 24, scale: 0.97 },
        };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-50 flex ${side ? "justify-end" : "items-end justify-center p-0 sm:items-center sm:p-6"}`}>
          <m.div
            className="absolute inset-0 bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panel}
            data-modal
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={`relative flex max-h-full flex-col bg-milk outline-none ${
              side
                ? "h-full w-full max-w-[460px] shadow-2xl"
                : "max-h-[94svh] w-full rounded-t-[2rem] shadow-2xl sm:max-h-[90svh] sm:rounded-[2rem]"
            } ${className}`}
            {...panelMotion}
            transition={side ? { type: "spring", stiffness: 380, damping: 38 } : { type: "spring", stiffness: 340, damping: 28 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-cream text-forest shadow-[var(--shadow-sticker)] transition-transform duration-300 ease-[var(--ease-bounce)] hover:rotate-90"
              aria-label={closeLabel}
            >
              <Icon name="close" />
            </button>
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
