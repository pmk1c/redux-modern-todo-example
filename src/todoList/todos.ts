import { nanoid } from "nanoid";
import { UnknownAction } from "redux";
import { createSelector } from "reselect";

import { Todo } from "./types";
import { AppDispatch, RootState } from "../store";
import todosApi from "../todosApi";
import { setNotification } from "../notificationBar/notification";

// ACTION CREATORS
type SetTodoAction = ReturnType<typeof setTodo>;

export const setTodo = (todo: Todo) => ({
  type: "todos/setTodo",
  payload: {
    todo,
  },
});

type DeleteTodoAction = ReturnType<typeof deleteTodo>;

export const deleteTodo = (id: string) => ({
  type: "todos/deleteTodo",
  payload: {
    id,
  },
});

export const createTodo =
  (content: string) => async (dispatch: AppDispatch) => {
    const todo = {
      id: nanoid(),
      content,
      completedAt: null,
    };

    try {
      dispatch(setTodo(todo));

      const createdTodo = await todosApi.create(todo);

      dispatch(setTodo(createdTodo));
    } catch (error) {
      dispatch(deleteTodo(todo.id));
      dispatch(setNotification("Failed to create todo. Please try again."));
    }
  };

export const updateTodo =
  (id: string, attributes: { completed: boolean }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const todo = selectTodo(getState(), id);
    try {
      const changedTodo = {
        ...todo,
        completedAt: attributes.completed ? new Date().toISOString() : null,
      };
      dispatch(setTodo(changedTodo));

      const updatedTodo = await todosApi.update(changedTodo);
      dispatch(setTodo(updatedTodo));
    } catch (error) {
      dispatch(setTodo(todo));
      dispatch(setNotification("Failed to update todo. Please try again."));
    }
  };

// REDUCER
const initialState = {} as Record<string, Todo>;

export function todosReducer(
  state = initialState,
  action: UnknownAction,
): Record<string, Todo> {
  const { type } = action;

  if (type === "todos/setTodo") {
    const {
      payload: { todo },
    } = action as SetTodoAction;

    return {
      ...state,
      [todo.id]: todo,
    };
  }

  if (type === "todos/deleteTodo") {
    const {
      payload: { id },
    } = action as DeleteTodoAction;

    const newState = { ...state };
    delete newState[id];
    return newState;
  }

  return state;
}

// SELECTORS
const selectTodo = (state: RootState, id: string) => state.todos[id];

export const selectTodos = createSelector(
  (state: RootState) => state.todos,
  (todos) => Object.values(todos),
);

export const selectCompletedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => todo.completedAt),
);

export const selectUncompletedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => !todo.completedAt),
);
