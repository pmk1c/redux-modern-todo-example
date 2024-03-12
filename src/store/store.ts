import { combineSlices, configureStore } from "@reduxjs/toolkit";

import todosSlice from "../features/todoList/todosSlice";
import notificationsSlice from "../features/notificationBar/notificationsSlice";

const reducer = combineSlices(todosSlice, notificationsSlice);

const store = configureStore({
  reducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
