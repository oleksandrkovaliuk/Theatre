import { createAsyncThunk } from "@reduxjs/toolkit";
import { logIn } from "../../../../services/apiCallConfig";

export const loginUser = createAsyncThunk(
  "user/loginIn",
  async ({ email, password, jwt_user, cookie }, { rejectWithValue }) => {
    try {
      const res = await logIn({ email, password, jwt_user, cookie });
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
