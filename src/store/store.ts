import {
  applyMiddleware,
  legacy_createStore,
  combineReducers,
  Reducer,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { thunk } from "redux-thunk";

import { todosReducer } from "../features/todoList/todos";
import { notificationsReducer } from "../features/notificationBar/notifications";

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  todos: todosReducer,
});

// Fix rootReducer type for legacy_createStore
const fixedRootReducer = rootReducer as unknown as Reducer<
  ReturnType<typeof rootReducer>
>;

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));

const store = legacy_createStore(fixedRootReducer, composedEnhancer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
