import { createSlice } from "@reduxjs/toolkit";

export const userCheckLoginSlice = createSlice({
  name: "user",
  initialState: {
    loginned: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.loginned = action.payload;
    },
    deleteUser: (state) => {
      state.loginned = null;
    },
  },
});

export const { setUser, deleteUser } = userCheckLoginSlice.actions;
