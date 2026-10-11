import type { Todo, TodoFilters } from "../types/todo";

export function filterTodos(todos: Todo[], { search, status }: TodoFilters): Todo[] {
  const query = search.trim().toLowerCase();

  return todos.filter((todo) => {
    if (status === "active" && todo.completed) return false;
    if (status === "completed" && !todo.completed) return false;
    if (query && !todo.title.toLowerCase().includes(query)) return false;
    return true;
  });
}
