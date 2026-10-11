import type { ReactNode } from "react";
import { useTodos } from "../hooks/useTodos";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { storageName } = useTodos();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg bg-ink text-marker"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight text-ink">Todo Manager</h1>
            <p className="text-xs text-slate-500">Plan it, date it, tick it off.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <div className="space-y-5">{children}</div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        React · TypeScript · Vite · Tailwind CSS — saved in {storageName}
      </footer>
    </div>
  );
}
