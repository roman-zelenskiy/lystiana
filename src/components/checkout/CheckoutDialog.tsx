"use client";

import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { npCities } from "@/data/nova-poshta";
import { photo } from "@/data/photos";
import { expiryValid, formatCardNumber, formatExpiry, luhn } from "@/lib/card";
import { formatPrice } from "@/lib/format";
import { resolveItem, type ResolvedItem } from "@/lib/items";
import { formatPhone, isValidPhone } from "@/lib/phone";
import { cartTotals, useCart, type CartTotals } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { LeafFall } from "@/components/motion/LeafFall";
import { Combobox } from "@/components/ui/Combobox";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

type Method = "warehouse" | "postomat" | "courier";
type Pay = "card" | "cod";

type Form = {
  first: string;
  last: string;
  phone: string;
  email: string;
  method: Method;
  city: string | null;
  point: string | null;
  street: string;
  house: string;
  apt: string;
  comment: string;
  pay: Pay;
  card: string;
  exp: string;
  cvv: string;
};

const empty: Form = {
  first: "",
  last: "",
  phone: "",
  email: "",
  method: "warehouse",
  city: null,
  point: null,
  street: "",
  house: "",
  apt: "",
  comment: "",
  pay: "card",
  card: "",
  exp: "",
  cvv: "",
};

type Errors = Partial<Record<keyof Form, string>>;

const steps = ["Контакти", "Доставка", "Оплата", "Підтвердження"] as const;
const NAME = /^[\p{L}][\p{L}\s'’ʼ-]*$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(step: number, f: Form): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (f.first.trim().length < 2) e.first = "Вкажіть ім’я";
    else if (!NAME.test(f.first.trim())) e.first = "Лише літери, будь ласка";
    if (f.last.trim().length < 2) e.last = "Вкажіть прізвище — так написано в паспорті для Нової Пошти";
    else if (!NAME.test(f.last.trim())) e.last = "Лише літери, будь ласка";
    if (!isValidPhone(f.phone)) e.phone = f.phone ? "Номер неповний: +380 (XX) XXX-XX-XX" : "Вкажіть телефон — на нього прийде ТТН";
    if (!EMAIL.test(f.email.trim())) e.email = f.email ? "Перевірте адресу email" : "Вкажіть email для чека";
  }
  if (step === 1) {
    if (!f.city) e.city = "Оберіть місто зі списку";
    if (f.method !== "courier" && !f.point) e.point = f.method === "postomat" ? "Оберіть поштомат зі списку" : "Оберіть відділення зі списку";
    if (f.method === "courier") {
      if (f.street.trim().length < 3) e.street = "Вкажіть вулицю";
      if (!f.house.trim()) e.house = "Вкажіть номер будинку";
    }
  }
  if (step === 2 && f.pay === "card") {
    if (!luhn(f.card)) e.card = f.card ? "Номер картки некоректний (для демо: 4242 4242 4242 4242)" : "Вкажіть номер картки";
    if (!expiryValid(f.exp)) e.exp = f.exp ? "Термін дії минув або вказаний неправильно" : "ММ/РР";
    if (!/^\d{3}$/.test(f.cvv)) e.cvv = "3 цифри зі звороту";
  }
  return e;
}

type Order = { number: string; items: (ResolvedItem & { qty: number })[]; totals: CartTotals; delivery: string; pay: Pay; name: string };

export function CheckoutDialog() {
  const open = useCheckout((s) => s.open);
  const closeCheckout = useCheckout((s) => s.close);
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [order, setOrder] = useState<Order | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const t = cartTotals(lines, promo);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusStep = () =>
    requestAnimationFrame(() => {
      body.current?.scrollTo({ top: 0 });
      document.getElementById("checkout-step")?.focus({ preventScroll: true });
    });

  const go = (to: number) => {
    if (to > step) {
      const e = validate(step, form);
      setErrors(e);
      const first = Object.keys(e)[0];
      if (first) {
        requestAnimationFrame(() => document.getElementById(`co-${first}`)?.focus());
        return;
      }
    }
    setDir(to > step ? 1 : -1);
    setStep(to);
    focusStep();
  };

  const city = npCities.find((c) => c.id === form.city);
  const point = city?.points.find((p) => p.id === form.point);
  const deliveryText =
    form.method === "courier"
      ? `Кур’єр Нової Пошти: ${city?.name ?? ""}, ${form.street.trim()}, ${form.house.trim()}${form.apt.trim() ? `, кв. ${form.apt.trim()}` : ""}`
      : `${form.method === "postomat" ? "Поштомат" : "Відділення"} №${point?.number ?? ""}: ${city?.name ?? ""}, ${point?.address ?? ""}`;

  const items = lines
    .map((l) => {
      const it = resolveItem(l.productId, l.size);
      return it ? { ...it, qty: l.qty } : null;
    })
    .filter((x): x is ResolvedItem & { qty: number } => !!x);

  const submit = () => {
    setStatus("loading");
    setTimeout(() => {
      setOrder({
        number: `LY-${String(Date.now()).slice(-6)}`,
        items,
        totals: t,
        delivery: deliveryText,
        pay: form.pay,
        name: form.first.trim(),
      });
      clear();
      setStatus("done");
      // дані картки не зберігаємо навіть у стані
      setForm((f) => ({ ...f, card: "", exp: "", cvv: "" }));
      focusStep();
    }, 1300);
  };

  const close = () => {
    if (status === "loading") return;
    closeCheckout();
    if (status === "done") {
      setTimeout(() => {
        setStep(0);
        setForm(empty);
        setErrors({});
        setStatus("idle");
        setOrder(null);
      }, 300);
    }
  };

  const done = status === "done" && order;

  return (
    <Modal open={open} onClose={close} labelledBy="checkout-title" className="sm:max-w-2xl">
      {done && <LeafFall />}
      <div className="border-b border-line px-5 pt-5 pb-4 md:px-8">
        <h2 id="checkout-title" className="display pr-12 text-2xl text-forest md:text-3xl">
          {done ? "Дякуємо за замовлення!" : "Оформлення замовлення"}
        </h2>
        {!done && <StepBar step={step} />}
      </div>

      <div ref={body} className="relative flex-1 overflow-x-hidden overflow-y-auto px-5 py-6 md:px-8">
        {done ? (
          <Success order={order} onClose={close} />
        ) : items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-lg font-bold">Кошик порожній — нема чого оформлювати.</p>
            <a href="#katalog" className="btn btn-forest mt-5" onClick={close}>
              До каталогу
            </a>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <m.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: 40 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 * dir }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            >
              <h3 id="checkout-step" tabIndex={-1} className="mb-5 text-xl font-black outline-none">
                Крок {step + 1} з 4. {steps[step]}
              </h3>

              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="first" label="Ім’я" error={errors.first}>
                    <input id="co-first" className="field" autoComplete="given-name" value={form.first} onChange={(e) => set("first", e.target.value)} {...aria("first", errors)} />
                  </Field>
                  <Field id="last" label="Прізвище" error={errors.last}>
                    <input id="co-last" className="field" autoComplete="family-name" value={form.last} onChange={(e) => set("last", e.target.value)} {...aria("last", errors)} />
                  </Field>
                  <Field id="phone" label="Телефон" error={errors.phone}>
                    <input
                      id="co-phone"
                      className="field"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+380 (__) ___-__-__"
                      value={form.phone}
                      onChange={(e) => set("phone", formatPhone(e.target.value))}
                      {...aria("phone", errors)}
                    />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <input id="co-email" className="field" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} {...aria("email", errors)} />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <fieldset>
                    <legend className="label">Спосіб доставки Новою Поштою</legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {(
                        [
                          { id: "warehouse", label: "Відділення", hint: "від 70 грн", icon: "box" },
                          { id: "postomat", label: "Поштомат", hint: "від 60 грн", icon: "locker" },
                          { id: "courier", label: "Кур’єр", hint: "від 110 грн", icon: "courier" },
                        ] as { id: Method; label: string; hint: string; icon: IconName }[]
                      ).map((m) => (
                        <label key={m.id} className="option-card">
                          <input
                            type="radio"
                            name="method"
                            className="sr-only"
                            checked={form.method === m.id}
                            onChange={() => {
                              set("method", m.id);
                              set("point", null);
                            }}
                          />
                          <Icon name={m.icon} />
                          <span className="font-black">{m.label}</span>
                          <span className="text-sm text-muted">{m.hint}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <Combobox
                    id="co-city"
                    label="Місто"
                    placeholder="Почніть вводити: Київ, Львів…"
                    options={npCities.map((c) => ({ id: c.id, label: c.name, hint: c.region }))}
                    value={form.city}
                    onChange={(v) => {
                      set("city", v);
                      set("point", null);
                    }}
                    error={errors.city}
                    emptyText="Такого міста немає в демо-довіднику"
                  />
                  {form.method === "courier" ? (
                    <div className="grid gap-4 sm:grid-cols-[1fr_7rem_7rem]">
                      <Field id="street" label="Вулиця" error={errors.street}>
                        <input id="co-street" className="field" autoComplete="address-line1" value={form.street} onChange={(e) => set("street", e.target.value)} {...aria("street", errors)} />
                      </Field>
                      <Field id="house" label="Будинок" error={errors.house}>
                        <input id="co-house" className="field" value={form.house} onChange={(e) => set("house", e.target.value)} {...aria("house", errors)} />
                      </Field>
                      <Field id="apt" label="Квартира">
                        <input id="co-apt" className="field" value={form.apt} onChange={(e) => set("apt", e.target.value)} />
                      </Field>
                    </div>
                  ) : (
                    <Combobox
                      key={`${form.city}-${form.method}`}
                      id="co-point"
                      label={form.method === "postomat" ? "Поштомат" : "Відділення"}
                      placeholder={city ? "Номер або вулиця" : "Спершу оберіть місто"}
                      disabled={!city}
                      options={(city?.points ?? [])
                        .filter((p) => p.type === form.method)
                        .map((p) => ({ id: p.id, label: `${form.method === "postomat" ? "Поштомат" : "Відділення"} №${p.number}`, hint: p.address }))}
                      value={form.point}
                      onChange={(v) => set("point", v)}
                      error={errors.point}
                      emptyText={form.method === "postomat" ? "У цьому місті немає поштоматів у демо-довіднику — оберіть відділення" : "Нічого не знайдено"}
                    />
                  )}
                  <Field id="comment" label="Коментар (необов’язково)">
                    <textarea id="co-comment" className="field min-h-20" value={form.comment} onChange={(e) => set("comment", e.target.value)} placeholder="Наприклад: зателефонуйте за годину до доставки" />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5">
                  <DemoNote />
                  <fieldset>
                    <legend className="label">Спосіб оплати</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(
                        [
                          { id: "card", label: "Карткою онлайн (демо)", hint: "Visa, Mastercard", icon: "card" },
                          { id: "cod", label: "При отриманні", hint: "комісія НП: 20 грн + 2%", icon: "cash" },
                        ] as { id: Pay; label: string; hint: string; icon: IconName }[]
                      ).map((p) => (
                        <label key={p.id} className="option-card">
                          <input type="radio" name="pay" className="sr-only" checked={form.pay === p.id} onChange={() => set("pay", p.id)} />
                          <Icon name={p.icon} />
                          <span className="font-black">{p.label}</span>
                          <span className="text-sm text-muted">{p.hint}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {form.pay === "card" && (
                    <div className="grid gap-4 rounded-3xl bg-paper p-4 sm:grid-cols-[1fr_7rem_6rem]">
                      <Field id="card" label="Номер картки" error={errors.card}>
                        <input
                          id="co-card"
                          className="field font-mono tracking-wider"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="4242 4242 4242 4242"
                          value={form.card}
                          onChange={(e) => set("card", formatCardNumber(e.target.value))}
                          {...aria("card", errors)}
                        />
                      </Field>
                      <Field id="exp" label="Термін" error={errors.exp}>
                        <input id="co-exp" className="field" inputMode="numeric" autoComplete="off" placeholder="ММ/РР" value={form.exp} onChange={(e) => set("exp", formatExpiry(e.target.value))} {...aria("exp", errors)} />
                      </Field>
                      <Field id="cvv" label="CVV" error={errors.cvv}>
                        <input
                          id="co-cvv"
                          className="field"
                          inputMode="numeric"
                          autoComplete="off"
                          type="password"
                          maxLength={3}
                          value={form.cvv}
                          onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                          {...aria("cvv", errors)}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5">
                  <DemoNote />
                  <Summary items={items} totals={t} />
                  <dl className="grid gap-3 rounded-3xl bg-paper p-4 text-[0.97rem]">
                    <Row label="Отримувач" value={`${form.first.trim()} ${form.last.trim()}, ${form.phone}`} onEdit={() => go(0)} />
                    <Row label="Доставка" value={deliveryText} onEdit={() => go(1)} />
                    <Row label="Оплата" value={form.pay === "card" ? `Картка •••• ${form.card.slice(-4)} (демо)` : "При отриманні"} onEdit={() => go(2)} />
                  </dl>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        )}
      </div>

      {!done && items.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-line bg-cream px-5 py-4 md:px-8">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)} disabled={status === "loading"}>
              <Icon name="arrow-left" /> Назад
            </button>
          ) : (
            <span className="text-sm text-muted">
              Разом: <b className="text-ink">{formatPrice(t.total)}</b>
            </span>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-forest" onClick={() => go(step + 1)}>
              Далі <Icon name="arrow" />
            </button>
          ) : (
            <button type="button" className="btn btn-coral min-w-[13rem]" onClick={submit} disabled={status === "loading"} aria-busy={status === "loading"}>
              {status === "loading" ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" aria-hidden="true" /> Оформлюємо…
                </>
              ) : (
                <>Підтвердити · {formatPrice(t.total)}</>
              )}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}

const aria = (key: keyof Form, errors: Errors) => ({
  "aria-invalid": !!errors[key],
  "aria-describedby": errors[key] ? `co-${key}-error` : undefined,
});

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={`co-${id}`} className="label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`co-${id}-error`} className="error">
          {error}
        </p>
      )}
    </div>
  );
}

function StepBar({ step }: { step: number }) {
  return (
    <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Кроки оформлення">
      {steps.map((s, i) => (
        <li key={s} aria-current={i === step ? "step" : undefined} className="text-center">
          <span className="relative block h-2 overflow-hidden rounded-full bg-line">
            <m.span
              className="absolute inset-0 origin-left rounded-full bg-forest"
              initial={false}
              animate={{ scaleX: i < step ? 1 : i === step ? 0.5 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            />
          </span>
          <span className={`mt-1.5 block text-xs font-extrabold sm:text-sm ${i === step ? "text-forest" : "text-muted"}`}>
            {s}
            {i < step && <span className="sr-only"> — заповнено</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function DemoNote() {
  return (
    <p className="flex items-start gap-2 rounded-2xl bg-butter px-4 py-3 text-[0.95rem] font-bold">
      <Icon name="sparkle" size={20} className="mt-0.5 shrink-0" />
      <span>
        Це демо-магазин: оплата не списується, а дані картки нікуди не надсилаються і не зберігаються. Не вводьте справжню картку — спробуйте 4242 4242 4242 4242.
      </span>
    </p>
  );
}

function Row({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <dt className="text-sm font-extrabold text-muted">{label}</dt>
        <dd>{value}</dd>
      </div>
      <button type="button" className="shrink-0 py-1 text-sm font-extrabold text-forest underline underline-offset-4" onClick={onEdit} aria-label={`Змінити: ${label.toLowerCase()}`}>
        Змінити
      </button>
    </div>
  );
}

function Summary({ items, totals }: { items: (ResolvedItem & { qty: number })[]; totals: CartTotals }) {
  return (
    <div>
      <ul className="grid gap-2">
        {items.map((it) => (
          <li key={`${it.id}:${it.size}`} className="flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-paper">
              <Image src={photo(it.photo)} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold">{it.name}</span>
              <span className="block text-sm text-muted">
                {it.id.startsWith("nabir-") ? "набір" : it.size} × {it.qty}
              </span>
            </span>
            <span className="font-bold">{formatPrice(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 grid gap-1 border-t border-dashed border-line pt-3">
        {totals.discount > 0 && (
          <div className="flex justify-between text-coral-deep">
            <dt>Знижка за промокодом</dt>
            <dd className="font-bold">−{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Доставка</dt>
          <dd className="font-bold">{totals.freeShipping ? "безкоштовно" : "за тарифами НП"}</dd>
        </div>
        <div className="flex justify-between text-lg">
          <dt className="font-black">Разом</dt>
          <dd className="font-black">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function Success({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="relative z-10">
      <h3 id="checkout-step" tabIndex={-1} className="sr-only">
        Замовлення {order.number} оформлено
      </h3>
      <m.div
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest text-butter"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 12 }}
      >
        <Icon name="check" size={40} strokeWidth={3} />
      </m.div>
      <p className="mt-5 text-center text-lg">
        {order.name}, ваше замовлення <b className="whitespace-nowrap">№ {order.number}</b> прийнято.
      </p>
      <p className="mx-auto mt-3 max-w-md rounded-2xl bg-butter px-4 py-3 text-center font-bold">
        Це демо-замовлення: його ніхто не отримає, гроші не списано, а рослини, на жаль, не приїдуть.
      </p>
      <div className="mt-6 rounded-3xl bg-paper p-4">
        <Summary items={order.items} totals={order.totals} />
        <p className="mt-3 text-sm text-muted">
          {order.delivery} · {order.pay === "card" ? "Оплачено карткою (демо)" : "Оплата при отриманні"}
        </p>
      </div>
      <button type="button" className="btn btn-forest mx-auto mt-6 flex" onClick={onClose}>
        Повернутися до покупок
      </button>
    </div>
  );
}
