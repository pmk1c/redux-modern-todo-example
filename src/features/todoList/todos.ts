import {
  createAction,
  createSelector,
  isAnyOf,
  nanoid,
  UnknownAction,
} from "@reduxjs/toolkit";

import { Todo } from "./types";
import { AppDispatch, RootState } from "../../store/store";
import todosApi from "../../todosApi";

// ACTION CREATORS
export const upsertTodo = createAction("todos/upsertTodo", (todo: Todo) => ({
  payload: todo,
}));

export const createTodoSuccess = createAction(
  "todos/createtodoSuccess",
  (todo: Todo) => ({
    payload: todo,
  }),
);

export const createTodoError = createAction(
  "todos/createTodoError",
  (id: string) => ({
    payload: id,
    meta: { notification: "Failed to create todo. Please try again." },
  }),
);

export const updateTodoSuccess = createAction(
  "todos/updateTodoSuccess",
  (todo: Todo) => ({
    type: "todos/updateTodoSuccess" as const,
    payload: todo,
  }),
);

export const updateTodoError = createAction(
  "todos/updateTodoError",
  (todo: Todo) => ({
    payload: todo,
    meta: { notification: "Failed to update todo. Please try again." },
  }),
);

// THUNK CREATORS
export const createTodo =
  (content: string) => async (dispatch: AppDispatch) => {
    const todo = {
      id: nanoid(),
      content,
      completedAt: null,
    };

    try {
      dispatch(upsertTodo(todo));

      const createdTodo = await todosApi.create(todo);

      dispatch(createTodoSuccess(createdTodo));
    } catch (error) {
      dispatch(createTodoError(todo.id));
    }
  };

export const updateTodo =
  (id: string, { completed }: { completed: boolean }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const todo = selectTodo(getState(), id);
    if (!todo) throw new Error(`Todo with id ${id} not found.`);

    try {
      const changedTodo = {
        ...todo,
        completedAt: completed ? new Date().toISOString() : null,
      };
      dispatch(upsertTodo(changedTodo));

      const updatedTodo = await todosApi.update(changedTodo);
      dispatch(updateTodoSuccess(updatedTodo));
    } catch (error) {
      dispatch(updateTodoError(todo));
    }
  };

// REDUCER
const initialState = {} as Record<string, Todo | undefined>;

export const todosReducer = (state = initialState, action: UnknownAction) => {
  if (
    isAnyOf(
      upsertTodo,
      createTodoSuccess,
      updateTodoSuccess,
      updateTodoError,
    )(action)
  ) {
    return { ...state, [action.payload.id]: action.payload };
  }

  if (createTodoError.match(action)) {
    return { ...state, [action.payload]: undefined };
  }

  return state;
};

// SELECTORS
const selectTodo = (state: RootState, id: string) => state.todos[id];

export const selectTodos = createSelector(
  (state: RootState) => state.todos,
  (todos) => Object.values(todos).filter(Boolean) as Todo[],
);

export const selectCompletedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => todo.completedAt),
);

export const selectUncompletedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => !todo.completedAt),
);
