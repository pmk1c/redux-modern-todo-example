import {
  createAction,
  createSelector,
  isAnyOf,
  isRejectedWithValue,
  nanoid,
  UnknownAction,
} from "@reduxjs/toolkit";

import { Todo } from "./types";
import { RootState } from "../../store/store";
import todosApi from "../../todosApi";
import { createAppAsyncThunk } from "../../store/creators";

// ACTION CREATORS
export const upsertTodo = createAction("todos/upsertTodo", (todo: Todo) => ({
  payload: todo,
}));

// THUNK CREATORS
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
  thunkApi.dispatch(upsertTodo(todo));

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
>("todos/updateTodo", async ({ id, completed }: UpdateTodo, thunkApi) => {
  const todo = selectTodo(thunkApi.getState() as RootState, id) as Todo; // break type dependency cycle by providing a type for todo;
  const changedTodo = {
    ...todo,
    completedAt: completed ? new Date().toISOString() : null,
  };
  thunkApi.dispatch(upsertTodo(changedTodo));

  try {
    const updatedTodo = await todosApi.update(changedTodo);
    return updatedTodo;
  } catch {
    return thunkApi.rejectWithValue(todo, {
      notification: "Failed to update todo. Please try again.",
    });
  }
});

// REDUCER
const initialState = {} as Record<string, Todo | undefined>;

export const todosReducer = (state = initialState, action: UnknownAction) => {
  if (
    isAnyOf(upsertTodo, createTodo.fulfilled, updateTodo.fulfilled)(action) ||
    (isRejectedWithValue(updateTodo)(action) && action.payload)
  ) {
    if (!action.payload) return state;

    return { ...state, [action.payload.id]: action.payload };
  }

  if (isRejectedWithValue(createTodo)(action) && action.payload) {
    return { ...state, [action.payload.id]: undefined };
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
