import { lang } from "next/root-params";
import { getDict, isLang } from "./i18n";

/** Словник поточної мови для серверних компонентів — без прокидання lang через props */
export async function getI18n() {
  const l = await lang();
  return getDict(isLang(l) ? l : "uk");
}
