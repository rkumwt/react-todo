import type { TodoAction, TodoState } from "../types/todo";
import { generateId } from "../utils/id";

export const initialState: TodoState = { todos: [] };

// Pure function: always return a NEW state object so React sees a new reference.
export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    // Replaces state with data loaded from the storage backend
    case "HYDRATE":
      return { ...state, ...action.payload };

    case "ADD": {
      const now = Date.now();
      return {
        ...state,
        todos: [
          { id: generateId(), ...action.payload, createdAt: now, updatedAt: now },
          ...state.todos,
        ],
      };
    }

    case "UPDATE":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.data, updatedAt: Date.now() }
            : todo
        ),
      };

    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
            : todo
        ),
      };

    case "DELETE":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };

    default:
      return state;
  }
}
