import {
  createAction,
  createSelector,
  nanoid,
  UnknownAction,
} from "@reduxjs/toolkit";

import { Todo } from "./types";
import { AppDispatch, RootState } from "../store";
import todosApi from "../todosApi";
import { setNotification } from "../notificationBar/notification";

// ACTION CREATORS
export const setTodo = createAction<Todo>("todos/setTodo");

export const deleteTodo = createAction<string>("todos/deleteTodo");

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
  if (setTodo.match(action)) {
    const { payload } = action;

    return {
      ...state,
      [payload.id]: payload,
    };
  }

  if (deleteTodo.match(action)) {
    const { payload } = action;

    const newState = { ...state };
    delete newState[payload];
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
