import { createContext } from "react";

export const NotificationContext = createContext({
  messageError: null,
  currentMessage: null,
  notificationMessage: null,
  setNotificationMessage: (value) => {},
});
