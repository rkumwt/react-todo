import type { StatusFilter, TodoFilters } from "../types/todo";
import { cn } from "../utils/cn";
import Button from "./ui/Button";

interface TodoToolbarProps {
  filters: TodoFilters;
  onChange: (filters: TodoFilters) => void;
  onAdd: () => void;
}

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function TodoToolbar({ filters, onChange, onAdd }: TodoToolbarProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by title"
          aria-label="Search todos by title"
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/20"
        />
      </div>

      {/* Status filter — radio group semantics */}
      <div
        role="radiogroup"
        aria-label="Filter by status"
        className="grid grid-cols-3 rounded-lg bg-slate-100 p-1"
      >
        {statusOptions.map((opt) => {
          const active = filters.status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ ...filters, status: opt.value })}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ink",
                active ? "bg-white text-ink shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <Button onClick={onAdd} className="sm:w-auto">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
        Add todo
      </Button>
    </section>
  );
}
