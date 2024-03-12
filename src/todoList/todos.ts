import {
  createAction,
  createSelector,
  isRejectedWithValue,
  nanoid,
  UnknownAction,
} from "@reduxjs/toolkit";

import { Todo } from "./types";
import { RootState } from "../store";
import todosApi from "../todosApi";
import { createAppAsyncThunk } from "../appRedux";

// ACTION CREATORS
export const setTodo = createAction<Todo>("todos/setTodo");

export const createTodo = createAppAsyncThunk<
  Todo,
  string,
  {
    rejectValue: Todo;
  }
>("todos/createTodo", async (content: string, thunkApi) => {
  const todo = {
    id: nanoid(),
    content,
    completedAt: null,
  };
  thunkApi.dispatch(setTodo(todo));

  try {
    const createdTodo = await todosApi.create(todo);
    return createdTodo;
  } catch {
    return thunkApi.rejectWithValue(todo, {
      notification: "Failed to create todo. Please try again.",
    });
  }
});

interface UpdateTodo {
  id: string;
  completed: boolean;
}

export const updateTodo = createAppAsyncThunk<
  Todo,
  UpdateTodo,
  {
    rejectValue: Todo;
  }
>(
  "todos/updateTodo",
  async ({ id, completed }: UpdateTodo, thunkApi) => {
    const todo = selectTodo(thunkApi.getState() as RootState, id);
    const changedTodo = {
      ...todo,
      completedAt: completed ? new Date().toISOString() : null,
    };
    thunkApi.dispatch(setTodo(changedTodo));

    try {
      const updatedTodo = await todosApi.update(changedTodo);
      return updatedTodo;
    } catch {
      return thunkApi.rejectWithValue(todo, {
        notification: "Failed to update todo. Please try again.",
      });
    }
  },
  {},
);

// REDUCER
const initialState = {} as Record<string, Todo>;

export function todosReducer(
  state = initialState,
  action: UnknownAction,
): Record<string, Todo> {
  if (
    setTodo.match(action) ||
    createTodo.fulfilled.match(action) ||
    updateTodo.fulfilled.match(action) ||
    isRejectedWithValue(updateTodo)(action)
  ) {
    const { payload } = action;
    if (!payload) return state;

    return {
      ...state,
      [payload.id]: payload,
    };
  }

  if (isRejectedWithValue(createTodo)(action)) {
    const { payload } = action;
    if (!payload) return state;

    const newState = { ...state };
    delete newState[payload.id];
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
