import React, { useContext, useEffect, useState } from "react";
import s from "./secondSection.module.scss";
import { EventsContext } from "../../../context/eventsContext";
import { EventCard } from "../../../components/eventCard";
import { getEvents } from "../../../services/apiCallConfig";
import { NotificationContext } from "../../../context/notificationContext";
export const SecondSection = () => {
  const { event, setCommingEvents } = useContext(EventsContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const getUpdatedEventInfo = async () => {
    try {
      const res = await getEvents();
      setCommingEvents(res.events);
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  useEffect(() => {
    getUpdatedEventInfo();
  }, []);
  return (
    <div className={s.upcomingEvents}>
      <h1 className={s.title}>Upcoming premiers</h1>
      <div className={s.cardContainer}>
        {event
          ?.sort((a, b) => b.id - a.id)
          .map((item) => (
            <EventCard key={item.id} eventInfoFromdb={item} />
          ))}
      </div>
    </div>
  );
};
