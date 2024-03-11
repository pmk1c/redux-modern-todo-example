import TodoItem from "./components/TodoItem";
import useTodoForm from "./hooks/useTodoForm";
import useTodoTabs from "./hooks/useTodoTabs";

function TodoList() {
  const { handleContentChange, handleSubmit } = useTodoForm();
  const { tabs, todos } = useTodoTabs();

  return (
    <div className="panel">
      <p className="panel-heading">TODO</p>

      <form className="panel-block" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="What needs to be done?"
          onChange={handleContentChange}
        />
      </form>

      <p className="panel-tabs">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={tab.active ? "is-active" : ""}
            onClick={tab.onClick}
          >
            {tab.label}
          </a>
        ))}
      </p>

      <ol>
        {todos.map((todo) => (
          <li className="panel-block" key={todo.id}>
            <TodoItem todo={todo} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TodoList;
