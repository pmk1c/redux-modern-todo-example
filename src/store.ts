import { applyMiddleware, legacy_createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { thunk } from "redux-thunk";

import { todosReducer } from "./todoList/todos";
import { notificationReducer } from "./notificationBar/notification";

const rootReducer = combineReducers({
  notification: notificationReducer,
  todos: todosReducer,
});

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));

const store = legacy_createStore(rootReducer, composedEnhancer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
