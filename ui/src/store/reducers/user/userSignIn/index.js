import { createReducer } from "@reduxjs/toolkit";
import { newUser } from "../../../thunks/user/signInUser";

const initState = {
  registered: null,
};
export const newUserReducer = createReducer(initState, (builder) => {
  builder.addCase(newUser.fulfilled, (state, action) => {
    state.registered = action.payload;
    return state;
  });
  builder.addCase(newUser.rejected, (state) => {
    state.registered = null;
    return state;
  });
});
