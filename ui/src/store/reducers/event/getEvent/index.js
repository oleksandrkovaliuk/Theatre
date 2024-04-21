import { createSlice } from "@reduxjs/toolkit";

export const eventReducer = createSlice({
  name: "event",
  initialState: {
    events: null,
  },
  reducers: {
    storeEvents: (state, action) => {
      state.events = action.payload;
    },
  },
});
export const { storeEvents } = eventReducer.actions;
