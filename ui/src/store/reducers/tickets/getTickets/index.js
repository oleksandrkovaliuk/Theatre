import { createReducer } from "@reduxjs/toolkit";
import {
  allBookedTicketsByUser,
  cancelBooked,
  deleteExpiredSeats,
} from "../../../thunks/tickets";
const initState = {
  list: [],
  loading: false,
};
export const ticketsReducer = createReducer(initState, (builder) => {
  builder.addCase(cancelBooked.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(cancelBooked.fulfilled, (state, action) => {
    state.list = action.payload.tickets;
    state.loading = false;
    return state;
  });
  builder.addCase(cancelBooked.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
  builder.addCase(allBookedTicketsByUser.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(allBookedTicketsByUser.fulfilled, (state, action) => {
    state.list = action.payload.tickets;
    state.loading = false;
    return state;
  });
  builder.addCase(allBookedTicketsByUser.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
  builder.addCase(deleteExpiredSeats.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(deleteExpiredSeats.fulfilled, (state, action) => {
    state.list = action.payload.tickets;
    state.loading = false;
    return state;
  });
  builder.addCase(deleteExpiredSeats.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
});
