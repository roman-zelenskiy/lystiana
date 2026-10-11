import type { StateStorage } from "zustand/middleware";

/**
 * localStorage, який не падає: у приватному режимі, з вимкненими cookies
 * чи при переповненні сховища дані живуть у пам’яті до перезавантаження.
 */
const memory = new Map<string, string>();

function local(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = "__lystiana_probe__";
    s.setItem(probe, probe);
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export const safeStorage: StateStorage = {
  getItem(name) {
    try {
      return local()?.getItem(name) ?? memory.get(name) ?? null;
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem(name, value) {
    memory.set(name, value);
    try {
      local()?.setItem(name, value);
    } catch {
      // сховище недоступне або переповнене — лишаємо копію в пам’яті
    }
  },
  removeItem(name) {
    memory.delete(name);
    try {
      local()?.removeItem(name);
    } catch {
      // див. вище
    }
  },
};
