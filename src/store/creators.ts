import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export type AsyncThunkConfig = {
  rejectedMeta: { notification?: string };
};

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
