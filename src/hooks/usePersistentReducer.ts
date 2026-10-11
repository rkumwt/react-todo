import { useEffect, useReducer, useRef, useState, type Reducer } from "react";
import type { PersistenceStatus, StorageAdapter } from "../types/storage";

interface Options<S, A> {
  reducer: Reducer<S, A>;
  initialState: S;
  storage: StorageAdapter;
  storageKey: string;
  /** Builds the action that replaces state with loaded data */
  hydrate: (loaded: S) => A;
}

/**
 * useReducer + any async StorageAdapter.
 * 1. Starts with initialState and status "loading".
 * 2. Loads saved state from the adapter, dispatches the hydrate action.
 * 3. After hydration, saves every state change back to the adapter.
 *
 * Saving is blocked until hydration finishes — otherwise the empty initial
 * state would overwrite the user's saved data on first render.
 */
export function usePersistentReducer<S, A>({
  reducer,
  initialState,
  storage,
  storageKey,
  hydrate,
}: Options<S, A>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState<PersistenceStatus>("loading");
  const hydratedRef = useRef(false);

  // Keep the latest hydrate fn without re-running the load effect
  const hydrateRef = useRef(hydrate);
  hydrateRef.current = hydrate;

  // 1) Load once per adapter/key
  useEffect(() => {
    let cancelled = false; // guards StrictMode double-run and unmount
    hydratedRef.current = false;
    setStatus("loading");

    storage
      .getItem<S>(storageKey)
      .then((saved) => {
        if (cancelled) return;
        if (saved !== null) dispatch(hydrateRef.current(saved));
        hydratedRef.current = true;
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(`[storage:${storage.name}] load failed`, error);
        hydratedRef.current = true; // allow the user to keep working
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [storage, storageKey]);

  // 2) Save on every change after hydration
  useEffect(() => {
    if (!hydratedRef.current) return;
    storage.setItem(storageKey, state).catch((error) => {
      console.error(`[storage:${storage.name}] save failed`, error);
    });
  }, [state, storage, storageKey]);

  return { state, dispatch, status } as const;
}
