import { useDispatch } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectedMeta: { notification?: string };
}>();
