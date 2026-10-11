/**
 * Форматування без Intl: однаковий результат на сервері й у браузері
 * (Intl у Node та в браузері може відрізнятися пробілом-розділювачем — це hydration mismatch).
 */
export function formatPrice(n: number) {
  const s = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s} грн`;
}

/** Українські відмінки: plural(3, ["товар", "товари", "товарів"]) → "товари" */
export function plural(n: number, [one, few, many]: readonly [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const discountPercent = (price: number, oldPrice?: number) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

export const formatNumber = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
