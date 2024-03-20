import { ActionForEventCard } from "./const";

export const setChangedEvent = (value) => {
  return {
    type: ActionForEventCard.SET_CHANGED_EVENT,
    payload: value,
  };
};
