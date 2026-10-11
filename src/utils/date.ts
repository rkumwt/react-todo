export type DueStatus = "none" | "overdue" | "today" | "upcoming";

/** Today in local time as "YYYY-MM-DD" (toISOString would use UTC). */
export function todayString(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** "2026-10-15" -> "15 Oct 2026" (parsed as a local date, no timezone shift). */
export function formatDisplayDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** ISO date strings compare correctly as plain strings. */
export function getDueStatus(lastDate: string | null): DueStatus {
  if (!lastDate) return "none";
  const today = todayString();
  if (lastDate < today) return "overdue";
  if (lastDate === today) return "today";
  return "upcoming";
}
