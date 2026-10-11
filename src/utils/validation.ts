import { DESCRIPTION_MAX, TITLE_MAX } from "./constants";
import { todayString } from "./date";

export interface TodoFormValues {
  title: string;
  description: string;
  lastDate: string; // "" when empty (native date input)
  completed: boolean;
}

export type TodoFormErrors = Partial<Record<keyof TodoFormValues, string>>;

export function validateTodo(values: TodoFormValues, isEdit: boolean): TodoFormErrors {
  const errors: TodoFormErrors = {};
  const title = values.title.trim();

  if (!title) errors.title = "Please enter a title.";
  else if (title.length > TITLE_MAX) errors.title = `Title can be at most ${TITLE_MAX} characters.`;

  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Description can be at most ${DESCRIPTION_MAX} characters.`;
  }

  // New todos can't start in the past; existing ones may already be past due
  if (!isEdit && values.lastDate && values.lastDate < todayString()) {
    errors.lastDate = "Last date can't be in the past.";
  }

  return errors;
}
