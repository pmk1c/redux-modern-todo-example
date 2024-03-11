import { Todo } from "./todoList/types";

const todosApi = {
  create: (todo: Todo) =>
    new Promise<Todo>((resolve, reject) =>
      setTimeout(() => (Math.random() > 0.1 ? resolve(todo) : reject()), 1000),
    ),
  update: (todo: Todo) =>
    new Promise<Todo>((resolve, reject) =>
      setTimeout(() => (Math.random() > 0.5 ? resolve(todo) : reject()), 1000),
    ),
};

export default todosApi;
