import React, { useContext } from "react";
import s from "./secondSection.module.scss";
import { EventsContext } from "../../../context/eventsContext";
import { EventCard } from "../../../components/eventCard";

export const SecondSection = () => {
  const { events } = useContext(EventsContext);
  return (
    <div className={s.upcomingEvents}>
      <h1 className={s.title}>Upcoming premiers</h1>
      <div className={s.cardContainer}>
        {events
          ?.sort((a, b) => b.id - a.id)
          .map((item) => (
            <EventCard key={item.id} eventInfoFromdb={item} />
          ))}
      </div>
    </div>
  );
};
