import { createReducer } from "@reduxjs/toolkit";
import { loginUser } from "../../thunks/user";

const initialState = {
  user: null,
  loading: false,
};

const userLoginReducer = createReducer(initialState, {
  [loginUser.pending]: (state) => {
    state.loading = true;
    return state;
  },
  [loginUser.rejected]: (state, action) => {
    state.loading = false;
    return state;
  },
  [loginUser.fulfilled]: (state, action) => {
    state.user = action.payload;
    state.loading = false;
    return state;
  },
});

export default userLoginReducer;
