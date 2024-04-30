import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  callForChangeMultipleEvents,
  callForChangeSingleEvent,
  callToDeleteEvent,
  creatingEvent,
  getEvents,
} from "../../../services/apiCallConfig";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (props, { rejectWithValue }) => {
    try {
      const res = await getEvents();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (
    { eventName, eventDisc, eventDate, eventAge, eventImg, hall, eventseats },
    { rejectWithValue }
  ) => {
    try {
      const res = await creatingEvent({
        eventName,
        eventDisc,
        eventDate,
        eventAge,
        eventImg,
        hall,
        eventseats,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeSingleEvent = createAsyncThunk(
  "events/changeSingleEvent",
  async (
    {
      id,
      currentDate,
      currentAge,
      currentName,
      currentDisc,
      currentImg,
      currentHall,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await callForChangeSingleEvent({
        id,
        currentDate,
        currentAge,
        currentName,
        currentDisc,
        currentImg,
        currentHall,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeMultipleEvents = createAsyncThunk(
  "events/changeMultipleEvents",
  async (dataWithChangedEvents, { rejectWithValue }) => {
    try {
      const res = await callForChangeMultipleEvents({
        dataWithChangedEvents,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await callToDeleteEvent({ id });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
