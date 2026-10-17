"use client";

import { useI18n } from "@/components/I18n";
import { other, rememberLang } from "@/lib/i18n";

/**
 * UA / EN: та сама сторінка іншою мовою. Повне перезавантаження — кошик і фільтри живуть у сторах,
 * які мають перечитати каталог потрібною мовою. Ручний вибір запам’ятовується.
 */
export function LangSwitch({ className = "grid", full = false }: { className?: string; full?: boolean }) {
  const { lang, t } = useI18n();
  const to = other(lang);
  return (
    <a
      href={`../${to}/`}
      hrefLang={to}
      lang={to}
      aria-label={t.header.switchLabel}
      onClick={() => rememberLang(to)}
      className={`h-11 min-w-11 shrink-0 place-items-center rounded-full bg-cream px-2.5 text-sm font-black text-forest ring-1 ring-line transition-colors hover:bg-sage sm:h-12 sm:min-w-12 ${className}`}
    >
      {full ? t.header.switchLabel : to === "en" ? "EN" : "UA"}
    </a>
  );
}
