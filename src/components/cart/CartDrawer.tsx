"use client";

import Image from "next/image";
import { useFormat, useI18n } from "@/components/I18n";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { photo } from "@/data/photos";
import { resolveItem } from "@/lib/items";
import { MAX_QTY, cartTotals, lineKey, useCart, useCartHydrated } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { useAnnounce } from "@/components/ui/announce";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { FreeShippingPlant } from "./FreeShippingPlant";

export function CartDrawer() {
  const dict = useI18n();
  const ui = dict.t;
  const c = ui.cart;
  const { formatPrice } = useFormat();
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const hydrated = useCartHydrated();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const removed = useCart((s) => s.removed);
  const { setQty, remove, undo } = useCart.getState();
  const startCheckout = useCheckout((s) => s.start);
  const say = useAnnounce((s) => s.say);
  const t = cartTotals(lines, promo);

  // «Скасувати» видно 6 секунд
  const [undoVisible, setUndoVisible] = useState(false);
  const [prevRemoved, setPrevRemoved] = useState(removed);
  if (removed !== prevRemoved) {
    setPrevRemoved(removed);
    setUndoVisible(!!removed);
  }
  useEffect(() => {
    if (!undoVisible) return;
    const id = setTimeout(() => setUndoVisible(false), 6000);
    return () => clearTimeout(id);
  }, [undoVisible]);

  const removedItem = removed ? resolveItem(removed.line.productId, removed.line.size, dict) : null;

  return (
    <Modal open={open} onClose={() => setOpen(false)} labelledBy="cart-title" variant="side" closeLabel={c.close}>
      <div className="flex items-center gap-3 border-b border-line px-5 pt-5 pb-4">
        <h2 id="cart-title" className="display text-3xl text-forest">
          {c.title}
        </h2>
        {t.count > 0 && (
          <span className="rounded-full bg-butter px-2.5 py-0.5 text-sm font-black">
            {ui.items(t.count)}
          </span>
        )}
      </div>

      {!hydrated ? null : lines.length === 0 ? (
        <EmptyCart onClose={() => setOpen(false)} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FreeShippingPlant total={t.total} />
            <ul className="mt-4 grid gap-3">
              <AnimatePresence initial={false} mode="popLayout">
                {lines.map((l) => {
                  const item = resolveItem(l.productId, l.size, dict);
                  if (!item) return null;
                  const key = lineKey(l);
                  return (
                    <m.li
                      key={key}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: 60, rotate: 4, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="flex gap-3 rounded-3xl bg-cream p-2.5 ring-1 ring-line/70"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-paper">
                        <Image src={photo(item.photo)} alt="" fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="leading-snug font-extrabold">{item.name}</p>
                          <button
                            type="button"
                            className="-mt-1 -mr-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-[#ffe4dd] hover:text-coral-deep"
                            onClick={() => {
                              remove(key);
                              say(c.removed(item.name));
                            }}
                            aria-label={c.removeAria(item.name, item.size)}
                          >
                            <Icon name="trash" size={19} />
                          </button>
                        </div>
                        <p className="text-sm text-muted">
                          {item.id.startsWith("nabir-") ? item.sizeLabel : `${item.size} · ${item.sizeLabel}`}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                          <div className="flex items-center rounded-full bg-paper p-0.5" role="group" aria-label={c.qtyOf(item.name)}>
                            <button type="button" className="qty-btn !h-9 !w-9" disabled={l.qty <= 1} onClick={() => setQty(key, l.qty - 1)} aria-label={ui.quick.less}>
                              <Icon name="minus" size={16} />
                            </button>
                            <span className="w-8 text-center font-black" aria-live="polite">
                              {l.qty}
                            </span>
                            <button type="button" className="qty-btn !h-9 !w-9" disabled={l.qty >= MAX_QTY} onClick={() => setQty(key, l.qty + 1)} aria-label={ui.quick.more}>
                              <Icon name="plus" size={16} />
                            </button>
                          </div>
                          <span className="font-black">{formatPrice(item.price * l.qty)}</span>
                        </div>
                      </div>
                    </m.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <PromoField />
          </div>

          <div className="border-t border-line bg-cream px-5 pt-4 pb-5">
            <dl className="grid gap-1.5 text-[0.98rem]">
              <div className="flex justify-between">
                <dt className="text-muted">{c.subtotal}</dt>
                <dd className="font-bold">{formatPrice(t.subtotal)}</dd>
              </div>
              {t.discount > 0 && (
                <div className="flex justify-between text-coral-deep">
                  <dt>{c.discount(promo ?? "")}</dt>
                  <dd className="font-bold">−{formatPrice(t.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">{c.delivery}</dt>
                <dd className="font-bold">{t.freeShipping ? c.free : c.byTariff}</dd>
              </div>
              <div className="mt-1 flex items-end justify-between border-t border-dashed border-line pt-2">
                <dt className="font-black">{c.total}</dt>
                <dd className="display text-2xl text-forest">{formatPrice(t.total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="btn btn-coral mt-4 h-14 w-full text-lg"
              onClick={() => {
                setOpen(false);
                startCheckout();
              }}
            >
              {c.checkout} <Icon name="arrow" />
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {undoVisible && removedItem && (
          <m.div
            className="absolute inset-x-4 bottom-4 z-10 flex items-center gap-3 rounded-2xl bg-ink p-3 pl-4 text-milk shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            role="status"
          >
            <span className="flex-1 text-sm">
              <b>{removedItem.name}</b> {c.undoText}
            </span>
            <button
              type="button"
              className="btn h-10 bg-butter px-4 text-ink"
              onClick={() => {
                undo();
                setUndoVisible(false);
                say(c.restored(removedItem.name));
              }}
            >
              <Icon name="undo" size={18} /> {c.undo}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

function PromoField() {
  const { site, t: ui } = useI18n();
  const { promoCodes } = site;
  const c = ui.cart;
  const promo = useCart((s) => s.promo);
  const applyPromo = useCart((s) => s.applyPromo);
  const removePromo = useCart((s) => s.removePromo);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return setError(c.promoEmpty);
    if (!applyPromo(code)) return setError(c.promoWrong);
    setError("");
    setCode("");
  };

  if (promo)
    return (
      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-butter px-4 py-2.5">
        <span className="font-bold">
          <Icon name="gift" size={18} className="mr-1.5 inline -translate-y-0.5" />
          {promo}: {promoCodes[promo].label}
        </span>
        <button type="button" onClick={removePromo} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/10" aria-label={c.promoRemove}>
          <Icon name="close" size={16} />
        </button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      <label htmlFor="promo" className="label">
        {c.promo}
      </label>
      <div className="flex gap-2">
        <input
          id="promo"
          className="field !min-h-11 uppercase"
          placeholder="LISTYANA10"
          autoComplete="off"
          value={code}
          aria-invalid={!!error}
          aria-describedby={error ? "promo-error" : undefined}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
        />
        <button type="submit" className="btn btn-ghost h-11 shrink-0 px-4">
          {c.apply}
        </button>
      </div>
      {error && (
        <p id="promo-error" className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  const c = useI18n().t.cart;
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <m.svg
        width="140"
        height="140"
        viewBox="0 0 120 120"
        aria-hidden="true"
        initial={{ y: 10, rotate: -6 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 8 }}
      >
        <ellipse cx="60" cy="108" rx="34" ry="5" fill="var(--color-line)" />
        <path d="M30 60h60l-7 44a5 5 0 0 1-5 4H42a5 5 0 0 1-5-4l-7-44Z" fill="var(--color-coral)" />
        <rect x="26" y="54" width="68" height="10" rx="5" fill="var(--color-coral-deep)" />
        <path d="M60 54V40" stroke="var(--color-forest)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M60 44c0-6-5-10-10-10 0 6 5 10 10 10Z" fill="var(--color-moss)" />
        <circle cx="48" cy="80" r="2.5" fill="var(--color-ink)" />
        <circle cx="72" cy="80" r="2.5" fill="var(--color-ink)" />
        <path d="M52 92c5-4 11-4 16 0" stroke="var(--color-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </m.svg>
      <p className="display mt-4 text-2xl text-forest">{c.emptyTitle}</p>
      <p className="mt-2 text-muted">{c.emptyText}</p>
      <a
        href="#katalog"
        className="btn btn-forest mt-6"
        onClick={onClose}
      >
        {c.shop} <Icon name="arrow" />
      </a>
    </div>
  );
}
