import { Todo } from "../types";
import { updateTodo } from "../todos";
import { useAppDispatch } from "../../appRedux";

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
          dispatch(updateTodo({ id: todo.id, completed: e.target.checked }))
        }
      />
      {todo.content}
    </label>
  );
}

export default TodoItem;
