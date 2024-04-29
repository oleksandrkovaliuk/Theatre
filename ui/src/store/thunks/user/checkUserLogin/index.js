import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkGitHubUser,
  checkLoginned,
} from "../../../../services/apiCallConfig";

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
export const checkUserFromGit = createAsyncThunk(
  "user/checkGitHubUser",
  async (props, { rejectWithValue }) => {
    try {
      const res = await checkGitHubUser();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
