# Todo Manager

A responsive todo manager built **without a UI component library**: every
component (modals, form, filters, badges, stats) is hand-built with Tailwind
utilities, Flexbox and Grid.

## Features
- Each todo has **Title, Description, Completed, Last date**
- **Add / Edit** in an accessible modal form with validation
  (required title, length limits, no past date for new todos)
- **Delete** asks for confirmation in a modal (focus starts on *Cancel*)
- **Checkbox** to mark a todo complete
- **Search by title** (debounced) + **All / Active / Completed** filter
- **Stats:** Total, Done, Left, Overdue + progress bar
- Due-date badges: overdue, due today, upcoming
- **Pluggable persistence** — localStorage (default), IndexedDB or in-memory, behind one `StorageAdapter` interface
- Fully responsive (bottom-sheet modals on mobile), keyboard accessible

## Run
```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build
npm run preview  # preview the build
```

## Structure
```
src/
├── components/
│   ├── ui/          Modal (portal, focus trap, Esc, scroll lock), Button
│   ├── StatsCards, TodoToolbar, TodoList, TodoItem,
│   └── TodoFormModal, ConfirmDialog, DueDateBadge
├── contexts/    TodoContext — state, dispatch, derived stats
├── hooks/       useTodos, usePersistentReducer, useDebounce,
│                useFocusTrap, useLockBodyScroll
├── layouts/     MainLayout
├── pages/       TodoPage — filters + modal state, composes the UI
├── reducers/    todoReducer — pure, returns new state
├── storage/     StorageAdapter implementations + factory + migration
├── types/       Todo, TodoInput, TodoAction, TodoStats, TodoFilters
└── utils/       storage, date, validation, filterTodos, cn, id, constants
```

## Architecture notes
- **Domain state** (todos) → `useReducer` + Context, persisted to localStorage.
- **UI state** (search, status filter, open modals) → local to `TodoPage`.
- Stats are **derived** with `useMemo`, never stored.
- Dates stored as `"YYYY-MM-DD"` strings — JSON-safe and comparable as strings;
  "today" is computed in local time to avoid UTC off-by-one bugs.
- No runtime dependencies beyond React.

## Switching storage (localStorage → IndexedDB)

All persistence goes through one interface (`src/types/storage.ts`):

```ts
interface StorageAdapter {
  readonly name: string;
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
```

It is async because IndexedDB (and any future API backend) is async.

**Option 1 — environment variable** (no code change):
```bash
cp .env.example .env
# .env
VITE_STORAGE_DRIVER=indexedDB   # localStorage | indexedDB | memory
```

**Option 2 — dependency injection** (e.g. tests or a custom backend):
```tsx
<TodoProvider storage={createIndexedDBAdapter({ dbName: "my-app" })}>
```

**Moving existing users' data** — run once at startup:
```ts
await migrateKey(createLocalStorageAdapter(), createIndexedDBAdapter(), STORAGE_KEY);
```

`createStorage()` falls back to localStorage, then memory, if the requested
backend is unavailable (private mode, old browsers). `usePersistentReducer`
shows a loading state while data loads and blocks saving until hydration
finishes, so the empty initial state can never overwrite saved data.

Adding a new backend (e.g. a REST API) means writing one file that
implements `StorageAdapter` — no component or reducer changes.
