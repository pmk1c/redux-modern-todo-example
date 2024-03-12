import { Todo } from "../types";
import { updateTodo } from "../todosSlice";
import { useAppDispatch } from "../../../store/hooks";

interface Props {
  todo: Todo;
}

function TodoItem({ todo }: Props) {
  const dispatch = useAppDispatch();

  return (
    <label>
      <input
        type="checkbox"
        checked={!!todo.completedAt}
        onChange={(e) =>
          dispatch(updateTodo(todo, { completed: e.target.checked }))
        }
      />
      {todo.content}
    </label>
  );
}

export default TodoItem;
