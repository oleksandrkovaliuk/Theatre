import { createContext } from "react";

export const userContext = createContext({
  userInfo: null,
  setUserInfo: (value) => {},
});
