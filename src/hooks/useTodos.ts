import { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";
import type { TodoInput } from "../types/todo";

/** Typed context access + action helpers so components never build actions by hand. */
export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used inside <TodoProvider>");

  const { state, dispatch, stats, status, storageName } = ctx;

  return {
    todos: state.todos,
    stats,
    status,
    storageName,
    addTodo: (data: TodoInput) => dispatch({ type: "ADD", payload: data }),
    updateTodo: (id: string, data: TodoInput) =>
      dispatch({ type: "UPDATE", payload: { id, data } }),
    toggleTodo: (id: string) => dispatch({ type: "TOGGLE", payload: { id } }),
    deleteTodo: (id: string) => dispatch({ type: "DELETE", payload: { id } }),
  };
}
