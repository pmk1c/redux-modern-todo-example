import { UnknownAction } from "redux";

import { RootState } from "../../store/store";

export const removeNotification = () => ({
  type: "notification/removeNotification" as const,
});

const initialState = null as string | null;

function getNotification(action: UnknownAction) {
  return typeof action.meta === "object" &&
    !!action.meta &&
    "notification" in action.meta &&
    typeof action.meta.notification === "string"
    ? action.meta.notification
    : null;
}

export const notificationsReducer = (
  state = initialState,
  action: UnknownAction,
) => {
  switch (action.type) {
    case "notification/removeNotification":
      return null;

    default:
      return getNotification(action) ? getNotification(action) : state;
  }
};

export const selectNotification = (state: RootState) => state.notifications;
