import { createReducer } from "@reduxjs/toolkit";
import { loginUser } from "../../../thunks/user/loginUser";

const initialState = {
  loginned: null,
};
const userLoginReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loginned = action.payload;
      return state;
    })
    .addCase(loginUser.rejected, (state) => {
      state.loginned = null;
      return state;
    })
);

export default userLoginReducer;
