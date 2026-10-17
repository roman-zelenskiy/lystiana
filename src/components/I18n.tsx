"use client";

import { createContext, useContext } from "react";
import { getDict, type Dict, type Lang } from "@/lib/i18n";
import { formatNumber, formatPrice } from "@/lib/format";

const I18nContext = createContext<Dict>(getDict("uk"));

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <I18nContext.Provider value={getDict(lang)}>{children}</I18nContext.Provider>;
}

/** Каталог, тексти й рядки інтерфейсу поточної мови для клієнтських компонентів */
export const useI18n = () => useContext(I18nContext);

/** Ціни й числа у форматі поточної мови: 1 500 грн / 1,500 UAH */
export function useFormat() {
  const { lang } = useI18n();
  return {
    formatPrice: (n: number) => formatPrice(n, lang),
    formatNumber: (n: number) => formatNumber(n, lang),
  };
}
