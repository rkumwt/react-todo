export default function TodoListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading todos"
      className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-start gap-3 px-5 py-4">
          <div className="size-5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
