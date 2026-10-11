import type { StorageAdapter } from "../types/storage";

/** Wraps the synchronous localStorage API in the async StorageAdapter contract. */
export function createLocalStorageAdapter(): StorageAdapter {
  return {
    name: "localStorage",

    async getItem<T>(key: string): Promise<T | null> {
      const raw = localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    },

    async setItem<T>(key: string, value: T): Promise<void> {
      localStorage.setItem(key, JSON.stringify(value));
    },

    async removeItem(key: string): Promise<void> {
      localStorage.removeItem(key);
    },
  };
}
