import {
  UnknownAction,
  createAction,
  createReducer,
  isRejected,
} from "@reduxjs/toolkit";

import { RootState } from "../../store/store";

export const removeNotification = createAction(
  "notification/removeNotification",
);

interface NotificationAction extends UnknownAction {
  meta: {
    notification: string;
  };
}

function hasNotification(action: UnknownAction): action is NotificationAction {
  return (
    isRejected(action) &&
    "notification" in action.meta &&
    typeof action.meta.notification === "string"
  );
}

const initialState = { notification: null as string | null };

export const notificationsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(removeNotification, (state) => {
      state.notification = null;
    })
    .addMatcher(hasNotification, (state, action) => {
      state.notification = action.meta.notification;
    });
});

export const selectNotification = (state: RootState) =>
  state.notifications.notification;
