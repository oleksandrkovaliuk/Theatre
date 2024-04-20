import { configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./reducers/user";
import userLoginReducer from "./reducers/userLogin";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    // userLogined: userLoginReducer,
  },
});
