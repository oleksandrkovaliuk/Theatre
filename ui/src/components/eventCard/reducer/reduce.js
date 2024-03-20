import { ActionForEventCard } from "./const";

export const InitState = {
  changedEvents: [],
};

export const reducer = (state, action) => {
  if (action.type === ActionForEventCard.SET_CHANGED_EVENT) {
    const updatedEvent = [...state.changedEvents];
    const existingIndex = updatedEvent.findIndex(
      (item) => item.id === action.payload?.id
    );
    if (existingIndex !== -1) {
      updatedEvent[existingIndex] = action.payload;
    } else {
      updatedEvent.push(action.payload);
    }
    return {
      ...state,
      changedEvents: updatedEvent,
    };
  }
};
