import { createAction, UnknownAction } from "@reduxjs/toolkit";

import { RootState } from "../../store/store";

export const removeNotification = createAction(
  "notification/removeNotification",
);

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
  if (removeNotification.match(action)) return null;

  if (getNotification(action)) return getNotification(action);

  return state;
};

export const selectNotification = (state: RootState) => state.notifications;
