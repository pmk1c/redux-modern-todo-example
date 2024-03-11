import { UnknownAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

type SetNotificationAction =
  | ReturnType<typeof setNotification>
  | ReturnType<typeof removeNotification>;

export const setNotification = (notification: string) => ({
  type: "notification/setNotification",
  payload: {
    notification,
  },
});

export const removeNotification = () => ({
  type: "notification/setNotification",
  payload: {
    notification: null,
  },
});

const initialState = null as string | null;

export const notificationReducer = (
  state = initialState,
  action: UnknownAction,
) => {
  const { type } = action;

  if (type === "notification/setNotification") {
    const {
      payload: { notification },
    } = action as SetNotificationAction;

    return notification;
  }

  return state;
};

export const selectNotification = (state: RootState) => state.notification;
