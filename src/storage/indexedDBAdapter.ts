import type { StorageAdapter } from "../types/storage";

interface IndexedDBOptions {
  dbName?: string;
  storeName?: string;
  version?: number;
}

/** Turn an IDBRequest into a Promise. */
function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * IndexedDB backend with zero dependencies.
 * Uses one object store as a key-value store. Values are stored as structured
 * clones (no JSON.stringify needed), so it handles large data well.
 */
export function createIndexedDBAdapter({
  dbName = "todo-app",
  storeName = "keyval",
  version = 1,
}: IndexedDBOptions = {}): StorageAdapter {
  // Open the database once, lazily, and reuse the connection
  let dbPromise: Promise<IDBDatabase> | null = null;

  const getDB = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          dbPromise = null; // allow a retry on the next call
          reject(request.error);
        };
      });
    }
    return dbPromise;
  };

  /** Run one request inside a transaction and wait for it to finish. */
  const run = async <T>(
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> => {
    const db = await getDB();
    const tx = db.transaction(storeName, mode);
    const result = await promisify(action(tx.objectStore(storeName)));
    // For writes, resolve only once the transaction is committed
    if (mode === "readwrite") {
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    }
    return result;
  };

  return {
    name: "indexedDB",

    async getItem<T>(key: string): Promise<T | null> {
      const value = await run("readonly", (store) => store.get(key));
      return (value ?? null) as T | null;
    },

    async setItem<T>(key: string, value: T): Promise<void> {
      await run("readwrite", (store) => store.put(value, key));
    },

    async removeItem(key: string): Promise<void> {
      await run("readwrite", (store) => store.delete(key));
    },
  };
}
