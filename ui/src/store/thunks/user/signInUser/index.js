import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInUser } from "../../../../services/apiCallConfig";

export const newUser = createAsyncThunk(
  "user/SignIn",
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const res = await signInUser({ username, email, password, role });
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
