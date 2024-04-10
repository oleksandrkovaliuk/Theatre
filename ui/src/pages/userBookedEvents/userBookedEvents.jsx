import React, { useCallback, useEffect, useState } from "react";
import u from "./userBookedEvents.module.scss";
import { checkLoginned } from "../../services/apiCallConfig";

export const UserBookedEvents = () => {
  const [listOfBookedEvents, setListOfBookedEvents] = useState([]);

  const getListOfBookedEventsByUser = useCallback(() => {
    try {
      const user = checkLoginned({ bookedEvents: true });
      console.log(user);
    } catch (error) {}
  }, []);
  useEffect(() => {
    getListOfBookedEventsByUser();
  }, [getListOfBookedEventsByUser]);
  return <div className={u.user}></div>;
};
