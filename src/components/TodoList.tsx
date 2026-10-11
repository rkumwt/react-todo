import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem";
import Button from "./ui/Button";

interface TodoListProps {
  todos: Todo[];
  hasAnyTodos: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onAdd: () => void;
}

export default function TodoList({ todos, hasAnyTodos, onEdit, onDelete, onAdd }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        {hasAnyTodos ? (
          <p className="text-slate-500">No todos match your search or filter.</p>
        ) : (
          <>
            <p className="mb-4 text-slate-500">No todos yet.</p>
            <Button onClick={onAdd}>Add your first todo</Button>
          </>
        )}
      </div>
    );
  }

  return (
    <section aria-label="Todos">
      <p className="mb-2 px-1 text-sm text-slate-500" aria-live="polite">
        Showing {todos.length} {todos.length === 1 ? "todo" : "todos"}
      </p>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {todos.map((todo) => (
          // Stable key from the todo id — never the array index
          <TodoItem key={todo.id} todo={todo} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  );
}
