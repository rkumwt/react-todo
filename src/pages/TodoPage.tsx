import { useMemo, useState } from "react";
import type { Todo, TodoFilters } from "../types/todo";
import { useTodos } from "../hooks/useTodos";
import { useDebounce } from "../hooks/useDebounce";
import { filterTodos } from "../utils/filterTodos";
import StatsCards from "../components/StatsCards";
import TodoToolbar from "../components/TodoToolbar";
import TodoList from "../components/TodoList";
import TodoFormModal from "../components/TodoFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import TodoListSkeleton from "../components/TodoListSkeleton";

/** Holds UI-only state (filters, which modal is open). Todos live in context. */
export default function TodoPage() {
  const { todos, deleteTodo, status, storageName } = useTodos();

  const [filters, setFilters] = useState<TodoFilters>({ search: "", status: "all" });
  const debouncedSearch = useDebounce(filters.search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const visibleTodos = useMemo(
    () => filterTodos(todos, { search: debouncedSearch, status: filters.status }),
    [todos, debouncedSearch, filters.status]
  );

  const openAdd = () => {
    setEditingTodo(null);
    setFormOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) deleteTodo(todoToDelete.id);
    setTodoToDelete(null);
  };

  return (
    <>
      <StatsCards />
      <TodoToolbar filters={filters} onChange={setFilters} onAdd={openAdd} />
      {status === "error" && (
        <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Saved todos couldn't be loaded from {storageName}. You can keep working, but changes may not be saved.
        </p>
      )}

      {status === "loading" ? (
        <TodoListSkeleton />
      ) : (
        <TodoList
          todos={visibleTodos}
          hasAnyTodos={todos.length > 0}
          onEdit={openEdit}
          onDelete={setTodoToDelete}
          onAdd={openAdd}
        />
      )}

      <TodoFormModal open={formOpen} todo={editingTodo} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={todoToDelete !== null}
        title="Delete this todo?"
        message={
          todoToDelete ? `"${todoToDelete.title}" will be removed permanently.` : ""
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setTodoToDelete(null)}
      />
    </>
  );
}
