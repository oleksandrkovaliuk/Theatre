import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./reducers/user";
import { eventsReducer } from "./reducers/event/getEvent";
import { ticketsReducer } from "./reducers/tickets/getTickets";

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
    tickets: ticketsReducer,
  },
});
