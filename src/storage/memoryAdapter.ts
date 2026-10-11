import type { StorageAdapter } from "../types/storage";

/**
 * In-memory backend: nothing survives a refresh.
 * Handy for unit tests and as a safe fallback when no browser storage exists.
 */
export function createMemoryAdapter(): StorageAdapter {
  const store = new Map<string, unknown>();

  return {
    name: "memory",
    async getItem<T>(key: string) {
      return store.has(key) ? (structuredClone(store.get(key)) as T) : null;
    },
    async setItem<T>(key: string, value: T) {
      store.set(key, structuredClone(value));
    },
    async removeItem(key: string) {
      store.delete(key);
    },
  };
}
