/**
 * Persistence contract. Every storage backend implements this, so the app
 * never knows (or cares) whether data lives in localStorage, IndexedDB, memory
 * or a remote API.
 *
 * It is async on purpose: localStorage is sync, but IndexedDB and any network
 * backend are async — an async contract fits all of them.
 */
export interface StorageAdapter {
  /** Human-readable name, useful for logs and the UI */
  readonly name: string;
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export type StorageDriver = "localStorage" | "indexedDB" | "memory";

export type PersistenceStatus = "loading" | "ready" | "error";
