import { UnknownAction, createAction, isRejected } from "@reduxjs/toolkit";

import { RootState } from "../store";

export const removeNotification = createAction(
  "notification/removeNotification",
);

const initialState = null as string | null;

export const notificationReducer = (
  state = initialState,
  action: UnknownAction,
) => {
  if (isRejected(action) && "notification" in action.meta) {
    return action.meta?.notification;
  }

  if (removeNotification.match(action)) {
    return null;
  }

  return state;
};

export const selectNotification = (state: RootState) => state.notification;
