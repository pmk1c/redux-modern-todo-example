import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  rejectedMeta: { notification?: string };
}>();
