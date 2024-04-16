import React, { useContext } from "react";
import s from "./secondSection.module.scss";
import { EventsContext } from "../../../context/eventsContext";
import { EventCard } from "../../../components/eventCard";
import { formatTime } from "../../../services/formatTime";

export const SecondSection = () => {
  const { events } = useContext(EventsContext);
  return (
    <div className={s.upcomingEvents}>
      <h1 className={s.title}>Upcoming premiers</h1>
      <div className={s.cardContainer}>
        {events
          ?.sort((a, b) => a.id - b.id)
          .filter(
            (item) => formatTime(item.startingtime) > formatTime(new Date())
          )
          .map((item) => (
            <EventCard key={item.id} eventInfoFromdb={item} />
          ))}
      </div>
    </div>
  );
};
