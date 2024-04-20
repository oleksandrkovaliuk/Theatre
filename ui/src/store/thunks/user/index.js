import { createAsyncThunk } from "@reduxjs/toolkit";
import { logIn } from "../../../services/apiCallConfig";

export const loginUser = createAsyncThunk(
  "userLogin/userLogin",
  async ({ email, password }) => {
    const res = await logIn({ email, password });

    return res;
  }
);
