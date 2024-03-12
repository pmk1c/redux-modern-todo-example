import {
  compose,
  createEntityAdapter,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";

import { Todo } from "./types";
import todosApi from "../../todosApi";
import { AsyncThunkConfig, createAppSlice } from "../../store/creators";

interface UpdateTodo extends Partial<Todo> {
  completed?: boolean;
}

const todosAdapter = createEntityAdapter<Todo>();
const todosAdapterSelectors = todosAdapter.getSelectors();

const prepareCreateTodo = (content: string) => ({
  id: nanoid(),
  content,
  completedAt: null,
});

const prepareUpdateTodo = (todo: Todo, { completed }: UpdateTodo) => ({
  staleTodo: todo,
  changedTodo: {
    ...todo,
    completedAt: completed ? new Date().toISOString() : null,
  },
});

export const todosSlice = createAppSlice({
  name: "todos",
  initialState: todosAdapter.getInitialState(),
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<AsyncThunkConfig>();

    return {
      createTodo: createAThunk(
        async (todo: Todo, thunkApi) => {
          try {
            const createdTodo = await todosApi.create(todo);
            return createdTodo;
          } catch {
            return thunkApi.rejectWithValue(null, {
              notification: "Failed to create todo. Please try again.",
            });
          }
        },
        {
          pending: (state, action) => {
            todosAdapter.addOne(state, action.meta.arg);
          },
          fulfilled: (state, action) => {
            todosAdapter.upsertOne(state, action.payload);
          },
          rejected: (state, action) => {
            todosAdapter.removeOne(state, action.meta.arg.id);
          },
        },
      ),
      updateTodo: createAThunk(
        async (
          { changedTodo }: ReturnType<typeof prepareUpdateTodo>,
          thunkApi,
        ) => {
          try {
            const updatedTodo = await todosApi.update(changedTodo);
            return updatedTodo;
          } catch {
            return thunkApi.rejectWithValue(null, {
              notification: "Failed to create todo. Please try again.",
            });
          }
        },
        {
          pending: (state, action) => {
            todosAdapter.upsertOne(state, action.meta.arg.changedTodo);
          },
          fulfilled: (state, action) => {
            todosAdapter.upsertOne(state, action.payload);
          },
          rejected: (state, action) => {
            todosAdapter.upsertOne(state, action.meta.arg.staleTodo);
          },
        },
      ),
    };
  },
  selectors: {
    selectTodo: todosAdapterSelectors.selectById,
    selectTodos: todosAdapterSelectors.selectAll,
    selectCompletedTodos: createSelector(
      todosAdapterSelectors.selectAll,
      (todos) => todos.filter((todo) => todo.completedAt),
    ),
    selectUncompletedTodos: createSelector(
      todosAdapterSelectors.selectAll,
      (todos) => todos.filter((todo) => !todo.completedAt),
    ),
  },
});

export const createTodo = compose(
  todosSlice.actions.createTodo,
  prepareCreateTodo,
);
export const updateTodo = compose(
  todosSlice.actions.updateTodo,
  prepareUpdateTodo,
);

export const {
  selectTodo,
  selectTodos,
  selectCompletedTodos,
  selectUncompletedTodos,
} = todosSlice.selectors;

export default todosSlice;
