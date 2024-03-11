import { useDispatch, useSelector } from "react-redux";

import { removeNotification, selectNotification } from "./notifications";
import { useEffect } from "react";

function NotificationBar() {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);

  useEffect(() => {
    const timeout = setTimeout(() => dispatch(removeNotification()), 10000);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  if (!notification) return;

  return (
    <div
      className="notification is-danger"
      style={{ position: "absolute", bottom: 20, left: 20 }}
    >
      <button
        className="delete"
        onClick={() => dispatch(removeNotification())}
      ></button>
      {notification}
    </div>
  );
}

export default NotificationBar;
