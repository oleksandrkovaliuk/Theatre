import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  bookedEventsByUser,
  cancelBookedSeat,
  deleteExpiredSeat,
} from "../../../services/apiCallConfig";

export const cancelBooked = createAsyncThunk(
  "tickets/cancelBookedSeat",
  async ({ eventId, seatsId, email, toShow }, { rejectWithValue }) => {
    try {
      const res = await cancelBookedSeat({
        eventId,
        seatsId,
        email,
        toShow,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const allBookedTicketsByUser = createAsyncThunk(
  "tickets/allBookedTicketsByUser",
  async (
    { email, toShow, search, filterByTime, filterByStatus },
    { rejectWithValue }
  ) => {
    try {
      const res = await bookedEventsByUser({
        email,
        toShow,
        search,
        filterByTime,
        filterByStatus,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteExpiredSeats = createAsyncThunk(
  "tickets/deleteExpiredSeats",
  async (
    { seat, email, toShow, search, filterByTime, filterByStatus },
    { rejectWithValue }
  ) => {
    try {
      const res = await deleteExpiredSeat({
        seat: seat,
        email: email,
        toShow: toShow,
        search: search,
        filterByTime: filterByTime,
        filterByStatus: filterByStatus,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
