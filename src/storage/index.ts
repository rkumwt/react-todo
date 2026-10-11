import type { StorageAdapter, StorageDriver } from "../types/storage";
import { createLocalStorageAdapter } from "./localStorageAdapter";
import { createIndexedDBAdapter } from "./indexedDBAdapter";
import { createMemoryAdapter } from "./memoryAdapter";

export { createLocalStorageAdapter, createIndexedDBAdapter, createMemoryAdapter };

const isLocalStorageAvailable = () => {
  try {
    const probe = "__storage_probe__";
    localStorage.setItem(probe, probe);
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

const isIndexedDBAvailable = () => typeof indexedDB !== "undefined";

/**
 * Factory: pick a backend by name, falling back gracefully when the
 * requested one isn't available (e.g. private mode, old browsers).
 */
export function createStorage(driver: StorageDriver): StorageAdapter {
  if (driver === "indexedDB" && isIndexedDBAvailable()) return createIndexedDBAdapter();
  if (driver !== "memory" && isLocalStorageAvailable()) return createLocalStorageAdapter();
  if (driver !== "memory") {
    console.warn(`[storage] "${driver}" unavailable — using in-memory storage.`);
  }
  return createMemoryAdapter();
}

/** Driver chosen at build time via VITE_STORAGE_DRIVER (default: localStorage). */
export function getConfiguredDriver(): StorageDriver {
  const value = import.meta.env.VITE_STORAGE_DRIVER;
  return value === "indexedDB" || value === "memory" ? value : "localStorage";
}
