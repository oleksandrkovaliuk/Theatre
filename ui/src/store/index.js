import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./reducers/user";
import { eventsReducer } from "./reducers/event/getEvent";

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
  },
});
