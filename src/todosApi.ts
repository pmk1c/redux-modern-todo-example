import { Todo } from "./features/todoList/types";

const breakCreate = false;
const breakUpdate = false;

const todosApi = {
  create: (todo: Todo) =>
    new Promise<Todo>((resolve, reject) =>
      setTimeout(() => (breakCreate ? reject() : resolve(todo)), 1000),
    ),
  update: (todo: Todo) =>
    new Promise<Todo>((resolve, reject) =>
      setTimeout(() => (breakUpdate ? reject() : resolve(todo)), 1000),
    ),
};

export default todosApi;
