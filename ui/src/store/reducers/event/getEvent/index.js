import { createReducer } from "@reduxjs/toolkit";
import {
  createEvent,
  fetchEvents,
  changeSingleEvent,
  changeMultipleEvents,
} from "../../../thunks/events";

const initState = {
  list: [],
  loading: false,
};
export const eventsReducer = createReducer(initState, (builder) => {
  builder.addCase(fetchEvents.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(fetchEvents.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading = false;
    return state;
  });
  builder.addCase(fetchEvents.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
  builder.addCase(createEvent.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(createEvent.fulfilled, (state, action) => {
    state.list = action.payload.events;
    state.loading = false;
    return state;
  });
  builder.addCase(createEvent.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
  builder.addCase(changeSingleEvent.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(changeSingleEvent.fulfilled, (state, action) => {
    state.list = action.payload.events;
    state.loading = false;
    return state;
  });
  builder.addCase(changeSingleEvent.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
  builder.addCase(changeMultipleEvents.pending, (state) => {
    state.loading = true;
    return state;
  });
  builder.addCase(changeMultipleEvents.fulfilled, (state, action) => {
    state.list = action.payload.events;
    state.loading = false;
    return state;
  });
  builder.addCase(changeMultipleEvents.rejected, (state) => {
    state.list = [];
    state.loading = false;
    return state;
  });
});
