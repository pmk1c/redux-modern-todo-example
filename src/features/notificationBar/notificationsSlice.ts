import { UnknownAction, isRejected } from "@reduxjs/toolkit";

import { createAppSlice } from "../../store/creators";

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

export const notificationsSlice = createAppSlice({
  name: "notifications",
  initialState: { notification: null as string | null },
  reducers: {
    removeNotification: (state) => {
      state.notification = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(hasNotification, (state, action) => {
      state.notification = action.meta.notification;
    });
  },
  selectors: {
    selectNotification: (state) => state.notification,
  },
});

export const { removeNotification } = notificationsSlice.actions;
export const { selectNotification } = notificationsSlice.selectors;

export default notificationsSlice;
