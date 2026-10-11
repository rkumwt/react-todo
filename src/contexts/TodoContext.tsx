import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import type { TodoAction, TodoState, TodoStats } from "../types/todo";
import type { PersistenceStatus, StorageAdapter } from "../types/storage";
import { initialState, todoReducer } from "../reducers/todoReducer";
import { usePersistentReducer } from "../hooks/usePersistentReducer";
import { createStorage, getConfiguredDriver } from "../storage";
import { STORAGE_KEY } from "../utils/constants";
import { getDueStatus } from "../utils/date";

export interface TodoContextValue {
  state: TodoState;
  dispatch: Dispatch<TodoAction>;
  stats: TodoStats;
  status: PersistenceStatus;
  storageName: string;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

interface TodoProviderProps {
  children: ReactNode;
  /**
   * Dependency injection: pass any StorageAdapter (IndexedDB, memory, API…).
   * Defaults to the driver configured in VITE_STORAGE_DRIVER.
   */
  storage?: StorageAdapter;
}

export function TodoProvider({ children, storage }: TodoProviderProps) {
  // Create the default adapter once (stable reference across renders)
  const [defaultStorage] = useState(() =>
    createStorage(getConfiguredDriver()),
  );
  const adapter = storage ?? defaultStorage;

  const { state, dispatch, status } = usePersistentReducer<
    TodoState,
    TodoAction
  >({
    reducer: todoReducer,
    initialState,
    storage: adapter,
    storageKey: STORAGE_KEY,
    hydrate: (loaded) => ({ type: "HYDRATE", payload: loaded }),
  });

  // Derived values — computed from todos, never stored
  const stats = useMemo<TodoStats>(() => {
    const total = state.todos.length;
    const done = state.todos.filter((t) => t.completed).length;
    const overdue = state.todos.filter(
      (t) => !t.completed && getDueStatus(t.lastDate) === "overdue",
    ).length;
    return { total, done, left: total - done, overdue };
  }, [state.todos]);

  const value = useMemo(
    () => ({ state, dispatch, stats, status, storageName: adapter.name }),
    [state, dispatch, stats, status, adapter.name],
  );

  return (
    <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
  );
}
