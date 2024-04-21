import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkLoginned } from "../../../../services/apiCallConfig";

export const checkUserLogin = createAsyncThunk(
  "user/checkLogin",
  async (props, { rejectWithValue }) => {
    try {
      const res = await checkLoginned();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
