import { createAction, createReducer } from "@reduxjs/toolkit";
import { loginUser } from "../../thunks/user/loginUser";
import { registerUser } from "../../thunks/user/registerUser";
import {
  checkUserFromGit,
  checkUserLogin,
} from "../../thunks/user/checkUserLogin";

export const deleteUser = createAction("user/delete");

const initState = {
  data: null,
};

export const userReducer = createReducer(initState, (builder) => {
  builder.addCase(registerUser.fulfilled, (state, action) => {
    const { user, jwtToken } = action.payload;
    state.data = user;
    localStorage.setItem("user_jwt_token", jwtToken);
    return state;
  });
  builder.addCase(registerUser.rejected, (state) => {
    state.data = null;
    return state;
  });
  builder.addCase(loginUser.fulfilled, (state, action) => {
    const { user, jwtToken } = action.payload;
    state.data = user;
    localStorage.setItem("user_jwt_token", jwtToken);
    return state;
  });
  builder.addCase(loginUser.rejected, (state) => {
    state.data = null;
    return state;
  });
  builder.addCase(checkUserLogin.fulfilled, (state, action) => {
    state.data = action.payload;
    return state;
  });
  builder.addCase(checkUserLogin.rejected, (state) => {
    state.data = null;
    return state;
  });
  builder.addCase(checkUserFromGit.fulfilled, (state, action) => {
    const { user, jwtToken } = action.payload;
    state.data = user;
    localStorage.setItem("user_jwt_token", jwtToken);
    return state;
  });
  builder.addCase(checkUserFromGit.rejected, (state) => {
    state.data = null;
    return state;
  });
  builder.addCase(deleteUser, (state) => {
    state.data = null;
    localStorage.removeItem("user_jwt_token");
    return state;
  });
});
