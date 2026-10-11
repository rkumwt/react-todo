import { formatDisplayDate, getDueStatus } from "../utils/date";
import { cn } from "../utils/cn";

interface DueDateBadgeProps {
  lastDate: string | null;
  completed: boolean;
}

export default function DueDateBadge({ lastDate, completed }: DueDateBadgeProps) {
  if (!lastDate) return null;

  const status = getDueStatus(lastDate);
  const date = formatDisplayDate(lastDate);

  let label = `Due ${date}`;
  let tone = "bg-blue-50 text-blue-700 ring-blue-200";

  if (completed) {
    tone = "bg-slate-100 text-slate-500 ring-slate-200";
  } else if (status === "overdue") {
    label = `Overdue · ${date}`;
    tone = "bg-red-50 text-red-700 ring-red-200";
  } else if (status === "today") {
    label = "Due today";
    tone = "bg-amber-50 text-amber-800 ring-amber-200";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tone
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}
