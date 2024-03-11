import { configureStore } from "@reduxjs/toolkit";

import { todosReducer } from "../features/todoList/todos";
import { notificationsReducer } from "../features/notificationBar/notifications";

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    todos: todosReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
