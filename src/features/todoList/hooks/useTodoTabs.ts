import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCompletedTodos,
  selectTodos,
  selectUncompletedTodos,
} from "../todosSlice";

type TabId = (typeof tabsStatic)[number]["id"];

const tabsStatic = [
  { id: "all", label: "All", selector: selectTodos },
  { id: "completed", label: "Completed", selector: selectCompletedTodos },
  { id: "uncompleted", label: "Uncompleted", selector: selectUncompletedTodos },
] as const;

function useTodoTabs() {
  const [activeTabId, setActiveTabId] = useState<TabId>("all");

  const tabs = tabsStatic.map((tab) => ({
    ...tab,
    active: tab.id === activeTabId,
    onClick: () => setActiveTabId(tab.id),
  }));

  const activeTab = tabs.find((tab) => tab.active)!;
  const todos = useSelector(activeTab.selector);

  return { tabs, todos };
}

export default useTodoTabs;
