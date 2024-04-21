import { createAsyncThunk } from "@reduxjs/toolkit";
import { logIn } from "../../../../services/apiCallConfig";

export const loginUser = createAsyncThunk(
  "user/LoginIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await logIn({ email, password });
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
