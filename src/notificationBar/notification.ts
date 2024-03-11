import { UnknownAction, createAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

export const setNotification = createAction<string>(
  "notification/setNotification",
);

export const removeNotification = createAction(
  "notification/removeNotification",
);

const initialState = null as string | null;

export const notificationReducer = (
  state = initialState,
  action: UnknownAction,
) => {
  if (setNotification.match(action)) {
    return action.payload;
  }

  if (removeNotification.match(action)) {
    return null;
  }

  return state;
};

export const selectNotification = (state: RootState) => state.notification;
