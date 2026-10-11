export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  /** Due date as "YYYY-MM-DD" (JSON-safe), or null when not set */
  lastDate: string | null;
  createdAt: number;
  updatedAt: number;
}

/** Fields the user fills in the add / edit modal */
export type TodoInput = Pick<Todo, "title" | "description" | "completed" | "lastDate">;

export interface TodoState {
  todos: Todo[];
}

export type TodoAction =
  | { type: "HYDRATE"; payload: TodoState }
  | { type: "ADD"; payload: TodoInput }
  | { type: "UPDATE"; payload: { id: string; data: TodoInput } }
  | { type: "TOGGLE"; payload: { id: string } }
  | { type: "DELETE"; payload: { id: string } };

export interface TodoStats {
  total: number;
  done: number;
  left: number;
  overdue: number;
}

export type StatusFilter = "all" | "active" | "completed";

export interface TodoFilters {
  search: string;
  status: StatusFilter;
}
