import { createContext } from "react";

export const EventsContext = createContext({
  event: null,
  setCommingEvents: (values) => {},
});
