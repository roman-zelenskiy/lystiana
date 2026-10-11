"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { nav } from "@/data/site";
import { CartButton } from "@/components/cart/CartButton";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { SearchBox } from "./SearchBox";

export function Header() {
  const { scrollY } = useScroll();
  const [raised, setRaised] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setRaised(y > 24));

  return (
    <header className="sticky top-0 z-40">
      <div className="wrap pt-3">
        <div className="relative flex items-center gap-2 rounded-full py-2 pr-1.5 pl-3 sm:gap-3 sm:pl-4 md:gap-6">
          {/* підкладка з’являється при скролі: лише прозорість і масштаб */}
          <m.div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full bg-cream/95 shadow-[var(--shadow-card)] ring-1 ring-line backdrop-blur"
            initial={false}
            animate={{ opacity: raised ? 1 : 0, scale: raised ? 1 : 0.97 }}
            transition={{ duration: 0.25 }}
          />
          <a href="#top" className="shrink-0 rounded-full" aria-label="«Листяна» — на початок сторінки">
            <Logo />
          </a>

          <nav aria-label="Розділи сторінки" className="hidden flex-1 lg:block">
            <ul className="flex items-center justify-center gap-1">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-block rounded-full px-3 py-2 font-bold transition-colors hover:bg-sage hover:text-forest"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto hidden w-[300px] md:block lg:ml-0">
            <SearchBox />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:ml-0">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-cream text-forest ring-1 ring-line sm:h-12 sm:w-12 md:hidden"
              aria-label="Пошук"
              aria-expanded={search}
              aria-controls="mobile-search"
              onClick={() => {
                setSearch((v) => !v);
                setMenu(false);
              }}
            >
              <Icon name={search ? "close" : "search"} />
            </button>
            <CartButton />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-cream text-forest ring-1 ring-line sm:h-12 sm:w-12 lg:hidden"
              aria-label="Меню"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => {
                setMenu((v) => !v);
                setSearch(false);
              }}
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300 ${menu ? "top-[7px] rotate-45" : "top-0"}`} />
                <span className={`absolute top-[7px] left-0 h-0.5 w-5 rounded bg-current transition-opacity ${menu ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300 ${menu ? "top-[7px] -rotate-45" : "top-[14px]"}`} />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {search && (
            <m.div
              id="mobile-search"
              className="mt-2 md:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <SearchBox autoFocus onDone={() => setSearch(false)} />
            </m.div>
          )}
          {menu && (
            <m.nav
              id="mobile-menu"
              aria-label="Розділи сторінки"
              className="mt-2 origin-top rounded-[2rem] bg-cream p-3 shadow-[var(--shadow-card)] ring-1 ring-line lg:hidden"
              initial={{ opacity: 0, scaleY: 0.85, y: -6 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.9, y: -6 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <ul className="grid gap-1">
                {nav.map((item, i) => (
                  <m.li key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setMenu(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-extrabold hover:bg-sage"
                    >
                      {item.label}
                      <Icon name="arrow" size={18} className="text-forest" />
                    </a>
                  </m.li>
                ))}
              </ul>
            </m.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
