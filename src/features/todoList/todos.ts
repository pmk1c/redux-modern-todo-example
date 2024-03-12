import {
  createAction,
  createEntityAdapter,
  createReducer,
  createSelector,
  isAnyOf,
  isRejectedWithValue,
  nanoid,
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
const todosAdapter = createEntityAdapter<Todo>();
const initialState = todosAdapter.getInitialState();

export const todosReducer = createReducer(initialState, (builder) => {
  builder
    .addMatcher(
      isAnyOf(
        upsertTodo,
        createTodo.fulfilled,
        updateTodo.fulfilled,
        isRejectedWithValue(updateTodo),
      ),
      (state, action) => {
        if (!action.payload) return;
        return todosAdapter.upsertOne(state, action.payload);
      },
    )
    .addMatcher(isRejectedWithValue(createTodo), (state, action) => {
      if (!action.payload) return;
      return todosAdapter.removeOne(state, action.payload.id);
    });
});

// SELECTORS
const todosAdapterSelectors = todosAdapter.getSelectors(
  (state: RootState) => state.todos,
);

export const { selectById: selectTodo, selectAll: selectTodos } =
  todosAdapterSelectors;

export const selectCompletedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => todo.completedAt),
);

export const selectUncompletedTodos = createSelector(selectTodos, (todos) =>
  todos.filter((todo) => !todo.completedAt),
);
