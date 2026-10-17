/** Nova Poshta demo directory in English: official Ukrainian transliteration (KMU 2010) of the same data */
import { npCities as uk, type NpCity } from "../nova-poshta";

const map: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch",
  ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "’": "", "ʼ": "", "'": "",
};
/** На початку слова є/ї/й/ю/я пишуться як ye/yi/y/yu/ya */
const initial: Record<string, string> = { є: "ye", ї: "yi", й: "y", ю: "yu", я: "ya" };

export function translit(s: string) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const lower = ch.toLowerCase();
    const start = i === 0 || /[\s\-«(.,]/.test(s[i - 1]);
    // «зг» передається як «zgh», щоб не плутати з «ж»
    let t = lower === "г" && s[i - 1]?.toLowerCase() === "з" ? "gh" : start && initial[lower] ? initial[lower] : map[lower];
    if (t === undefined) {
      out += ch;
      continue;
    }
    if (ch !== lower && t) t = t[0].toUpperCase() + t.slice(1);
    out += t;
  }
  return out;
}

const street = (a: string) => {
  const m = /^(вул\.|просп\.|пл\.)\s+(.+?),\s*(.+)$/.exec(a);
  if (!m) return translit(a);
  const kind = { "вул.": "St", "просп.": "Ave", "пл.": "Sq" }[m[1]]!;
  // «22 (ТРЦ «Глобус»)» → номер окремо, торговий центр — у кінці
  const num = m[3].replace(/\s*\(.*\)$/, "");
  const mall = /\(ТРЦ «(.+?)»\)/.exec(m[3]);
  return `${translit(num)} ${translit(m[2])} ${kind}${mall ? ` (${translit(mall[1])} mall)` : ""}`;
};

const regions: Record<string, string> = {
  kyiv: "Kyiv City",
  lviv: "Lviv Oblast",
  odesa: "Odesa Oblast",
  kharkiv: "Kharkiv Oblast",
  dnipro: "Dnipropetrovsk Oblast",
  vinnytsia: "Vinnytsia Oblast",
  "ivano-frankivsk": "Ivano-Frankivsk Oblast",
  poltava: "Poltava Oblast",
  chernihiv: "Chernihiv Oblast",
  uzhhorod: "Zakarpattia Oblast",
  zaporizhzhia: "Zaporizhzhia Oblast",
  rivne: "Rivne Oblast",
};

export type { NpCity, NpPoint } from "../nova-poshta";

export const npCities: NpCity[] = uk.map((c) => ({
  ...c,
  name: translit(c.name),
  region: regions[c.id] ?? translit(c.region),
  points: c.points.map((p) => ({ ...p, address: street(p.address) })),
}));
