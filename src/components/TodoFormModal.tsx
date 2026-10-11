import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Todo } from "../types/todo";
import { useTodos } from "../hooks/useTodos";
import { todayString } from "../utils/date";
import { DESCRIPTION_MAX, TITLE_MAX } from "../utils/constants";
import { validateTodo, type TodoFormErrors, type TodoFormValues } from "../utils/validation";
import { cn } from "../utils/cn";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

interface TodoFormModalProps {
  open: boolean;
  /** null = add mode, a todo = edit mode */
  todo: Todo | null;
  onClose: () => void;
}

const emptyValues: TodoFormValues = { title: "", description: "", lastDate: "", completed: false };

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-shadow",
    "focus:ring-2 focus:ring-ink/20",
    hasError ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-ink"
  );

export default function TodoFormModal({ open, todo, onClose }: TodoFormModalProps) {
  const { addTodo, updateTodo } = useTodos();
  const isEdit = todo !== null;
  const formId = useId();
  const titleRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<TodoFormValues>(emptyValues);
  const [errors, setErrors] = useState<TodoFormErrors>({});

  // Fill (edit) or reset (add) the form each time the modal opens
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setValues(
      todo
        ? {
            title: todo.title,
            description: todo.description,
            lastDate: todo.lastDate ?? "",
            completed: todo.completed,
          }
        : emptyValues
    );
  }, [open, todo]);

  const update = <K extends keyof TodoFormValues>(key: K, value: TodoFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateTodo(values, isEdit);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      if (found.title) titleRef.current?.focus();
      return;
    }

    const data = {
      title: values.title.trim(),
      description: values.description.trim(),
      lastDate: values.lastDate || null,
      completed: values.completed,
    };

    if (isEdit) updateTodo(todo.id, data);
    else addTodo(data);
    onClose();
  };

  const ids = {
    title: `${formId}-title`,
    description: `${formId}-description`,
    lastDate: `${formId}-lastDate`,
    completed: `${formId}-completed`,
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit todo" : "Add todo"}
      onClose={onClose}
      initialFocusRef={titleRef}
      closeOnBackdrop={false}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            {isEdit ? "Save changes" : "Add todo"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor={ids.title} className="mb-1.5 block text-sm font-medium text-slate-700">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            ref={titleRef}
            id={ids.title}
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            maxLength={TITLE_MAX}
            placeholder="e.g. Prepare for React interview"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? `${ids.title}-error` : undefined}
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <p id={`${ids.title}-error`} className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label htmlFor={ids.description} className="text-sm font-medium text-slate-700">
              Description
            </label>
            <span className="text-xs tabular-nums text-slate-400">
              {values.description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
          <textarea
            id={ids.description}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={DESCRIPTION_MAX}
            rows={3}
            placeholder="Add details (optional)"
            aria-invalid={!!errors.description}
            className={cn(inputClass(!!errors.description), "resize-y")}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        {/* Last date + completed side by side on wider screens */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.lastDate} className="mb-1.5 block text-sm font-medium text-slate-700">
              Last date
            </label>
            <input
              id={ids.lastDate}
              type="date"
              value={values.lastDate}
              min={isEdit ? undefined : todayString()}
              onChange={(e) => update("lastDate", e.target.value)}
              aria-invalid={!!errors.lastDate}
              aria-describedby={errors.lastDate ? `${ids.lastDate}-error` : undefined}
              className={inputClass(!!errors.lastDate)}
            />
            {errors.lastDate && (
              <p id={`${ids.lastDate}-error`} className="mt-1 text-xs text-red-600">{errors.lastDate}</p>
            )}
          </div>

          <div className="flex items-end">
            <label
              htmlFor={ids.completed}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-300 px-3 py-2.5"
            >
              <input
                id={ids.completed}
                type="checkbox"
                checked={values.completed}
                onChange={(e) => update("completed", e.target.checked)}
                className="size-4 accent-ink"
              />
              <span className="text-sm text-slate-700">Mark as completed</span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
