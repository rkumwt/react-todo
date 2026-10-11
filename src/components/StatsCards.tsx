import { useTodos } from "../hooks/useTodos";
import { cn } from "../utils/cn";

export default function StatsCards() {
  const { stats } = useTodos();
  const percent = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  const items = [
    { label: "Total", value: stats.total, tone: "text-ink" },
    { label: "Done", value: stats.done, tone: "text-emerald-700" },
    { label: "Left", value: stats.left, tone: "text-amber-700" },
    {
      label: "Overdue",
      value: stats.overdue,
      tone: stats.overdue ? "text-red-600" : "text-slate-500",
    },
  ];

  return (
    <section aria-label="Todo statistics" className="space-y-3 text-ink">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
          >
            <dt className="text-sm text-slate-500">{item.label}</dt>
            <dd
              className={cn(
                "text-3xl font-bold tabular-nums",
                item.tone,
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:px-5">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Completion"
        >
          <div
            className="h-full rounded-full bg-marker transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="w-10 text-right text-sm tabular-nums text-slate-500">
          {percent}%
        </span>
      </div>
    </section>
  );
}
