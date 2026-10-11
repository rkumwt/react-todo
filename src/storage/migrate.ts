import type { StorageAdapter } from "../types/storage";

/**
 * One-time copy of a key from one backend to another — e.g. move existing
 * users' todos from localStorage into IndexedDB so nobody loses data when the
 * driver is switched. Only copies when the target is still empty.
 */
export async function migrateKey(
  from: StorageAdapter,
  to: StorageAdapter,
  key: string
): Promise<boolean> {
  if (from.name === to.name) return false;

  const existing = await to.getItem(key);
  if (existing !== null) return false;

  const value = await from.getItem(key);
  if (value === null) return false;

  await to.setItem(key, value);
  await from.removeItem(key);
  return true;
}
