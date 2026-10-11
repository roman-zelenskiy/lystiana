"use client";

import { AnimatePresence, m } from "motion/react";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Підписка (демо): перевіряємо адресу, показуємо успіх, нікуди нічого не надсилаємо */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const error = !email.trim() ? "Вкажіть email, щоб ми знали, куди писати" : !EMAIL.test(email.trim()) ? "Схоже, в адресі помилка — перевірте, будь ласка" : "";
  const showError = touched && !!error;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (error) {
      document.getElementById("nl-email")?.focus();
      return;
    }
    setStatus("loading");
    setTimeout(() => setStatus("done"), 900);
  };

  return (
    <section aria-labelledby="nl-title" className="relative py-20 md:py-28">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-butter px-6 py-12 md:px-14 md:py-16">
          <svg className="absolute -right-10 -bottom-10 h-56 w-56 rotate-12 text-forest/10" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20C4 10 10 4 21 3c0 10-6 17-15 17H4Z" fill="currentColor" />
          </svg>
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="hand -rotate-2 text-2xl text-coral-deep">раз на два тижні, без спаму</p>
              <h2 id="nl-title" className="display mt-1 text-[clamp(2rem,4.4vw,3.4rem)] text-forest">
                Листи про рослини і −10% на перше замовлення
              </h2>
              <p className="mt-3 max-w-md text-ink/80">Сезонні поради з догляду, нові надходження і закриті розпродажі для підписників.</p>
            </div>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <m.div
                  key="done"
                  role="status"
                  className="rounded-[2rem] bg-cream p-6 text-center shadow-[var(--shadow-card)]"
                  initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                >
                  <m.span
                    className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest text-butter"
                    initial={{ x: -60, y: 30, rotate: -30 }}
                    animate={{ x: 0, y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 12 }}
                  >
                    <Icon name="mail" />
                  </m.span>
                  <p className="display mt-4 text-2xl text-forest">Лист уже летить!</p>
                  <p className="mt-2 text-muted">
                    Це демо-магазин, тож насправді лист не прийде. Але промокод на −10% справжній для цього сайту: <strong className="text-ink">LISTYANA10</strong>
                  </p>
                </m.div>
              ) : (
                <m.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0, y: -10 }} className="grid gap-2">
                  <label htmlFor="nl-email" className="label">
                    Ваш email
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="nl-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="olena@gmail.com"
                      className="field flex-1 !bg-cream"
                      value={email}
                      aria-invalid={showError}
                      aria-describedby={showError ? "nl-error" : "nl-note"}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(true)}
                    />
                    <button type="submit" className="btn btn-forest h-12" disabled={status === "loading"}>
                      {status === "loading" ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-milk border-t-transparent" aria-label="Надсилаємо" /> : "Підписатися"}
                    </button>
                  </div>
                  {showError ? (
                    <p id="nl-error" className="error" role="alert">
                      {error}
                    </p>
                  ) : (
                    <p id="nl-note" className="text-sm text-ink/70">
                      Демо-форма: адреса нікуди не надсилається і не зберігається.
                    </p>
                  )}
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
