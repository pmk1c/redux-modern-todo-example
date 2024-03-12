import { FormEvent, useState } from "react";

import { createTodo } from "../todosSlice";
import { useAppDispatch } from "../../../store/hooks";

function useTodoForm() {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");

  const handleContentChange = (e: FormEvent<HTMLInputElement>) => {
    setContent((e.target as HTMLInputElement).value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (e.target as HTMLFormElement).reset();
    dispatch(createTodo(content));
  };

  return {
    handleContentChange,
    handleSubmit,
  };
}

export default useTodoForm;
