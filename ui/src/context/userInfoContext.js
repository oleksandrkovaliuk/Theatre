import { createContext } from "react";

export const userContext = createContext({
  user: null,
  setUserInfo: (value) => {},
});
