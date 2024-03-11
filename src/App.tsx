import { Provider } from "react-redux";

import TodoList from "./todoList/TodoList";
import store from "./store";
import NotificationBar from "./notificationBar/NotificationBar";

function App() {
  return (
    <Provider store={store}>
      <main className="container" style={{ padding: 20, maxWidth: "640px" }}>
        <TodoList />
      </main>
      <NotificationBar />
    </Provider>
  );
}

export default App;
