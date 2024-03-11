import { UnknownAction, createSelector, nanoid } from "@reduxjs/toolkit";

import { Todo } from "./types";
import { AppDispatch, RootState } from "../../store/store";
import todosApi from "../../todosApi";

// ACTION CREATORS
export const upsertTodo = (todo: Todo) => ({
  type: "todos/upsertTodo" as const,
  payload: todo,
});

export const createTodoSuccess = (todo: Todo) => ({
  type: "todos/createtodoSuccess" as const,
  payload: todo,
});

export const createTodoError = (id: string) => ({
  type: "todos/createTodoError" as const,
  payload: id,
  meta: { notification: "Failed to create todo. Please try again." },
});

export const updateTodoSuccess = (todo: Todo) => ({
  type: "todos/updateTodoSuccess" as const,
  payload: todo,
});

export const updateTodoError = (todo: Todo) => ({
  type: "todos/updateTodoError" as const,
  payload: todo,
  meta: { notification: "Failed to update todo. Please try again." },
});

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
const initialState = {} as Record<string, Todo>;

export const todosReducer = (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case "todos/upsertTodo":
    case "todos/createTodoSuccess":
    case "todos/updateTodoSuccess":
    case "todos/updateTodoError":
      return {
        ...state,
        [(action.payload as Todo).id]: action.payload as Todo,
      };

    case "todos/createTodoError":
      return { ...state, [action.payload as string]: undefined };

    default:
      return state;
  }
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
