import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { todosReducer } from "./todoList/todos";
import { notificationReducer } from "./notificationBar/notification";

const rootReducer = combineReducers({
  notification: notificationReducer,
  todos: todosReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
