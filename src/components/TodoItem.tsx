import { useState } from "react";
import type { Todo } from "../types/todo";
import { useTodos } from "../hooks/useTodos";
import { cn } from "../utils/cn";
import DueDateBadge from "./DueDateBadge";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

const DESCRIPTION_PREVIEW = 140;

export default function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const { toggleTodo } = useTodos();
  const [expanded, setExpanded] = useState(false);

  const isLong = todo.description.length > DESCRIPTION_PREVIEW;
  const description =
    isLong && !expanded ? `${todo.description.slice(0, DESCRIPTION_PREVIEW).trimEnd()}…` : todo.description;

  return (
    <li className="group flex items-start gap-3 px-4 py-4 sm:px-5">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "not done" : "done"}`}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            className={cn(
              "break-words font-semibold",
              todo.completed ? "text-slate-400 line-through" : "text-slate-800"
            )}
          >
            {todo.title}
          </h3>
          <DueDateBadge lastDate={todo.lastDate} completed={todo.completed} />
        </div>

        {todo.description && (
          <p className="mt-1 whitespace-pre-line break-words text-sm text-slate-500">
            {description}
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-1 font-medium text-ink-soft hover:underline"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        )}
      </div>

      {/* Always visible on touch screens, revealed on hover/focus on larger screens */}
      <div className="flex shrink-0 gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(todo)}
          aria-label={`Edit "${todo.title}"`}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo)}
          aria-label={`Delete "${todo.title}"`}
          className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
