import { configureStore } from "@reduxjs/toolkit";

import { userCheckLoginSlice } from "./reducers/user/userCheckLogin";
import userLoginReducer from "./reducers/user/userLoginIn";
import { newUserReducer } from "./reducers/user/userSignIn";
import { eventReducer } from "./reducers/event/getEvent";
export const store = configureStore({
  reducer: {
    user: userCheckLoginSlice.reducer,
    loginInUser: userLoginReducer,
    newUser: newUserReducer,
    events: eventReducer.reducer,
  },
});
