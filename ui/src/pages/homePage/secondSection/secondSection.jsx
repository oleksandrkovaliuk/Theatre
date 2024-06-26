import React from "react";
import s from "./secondSection.module.scss";
import { EventCard } from "../../../components/eventCard";
import { formatTime } from "../../../services/formatTime";
import { useSelector } from "react-redux";

export const SecondSection = () => {
  const { events } = useSelector((state) => ({
    events: state.events.list,
  }));

  return (
    <div className={s.upcomingEvents}>
      <h1 className={s.title}>Upcoming premiers</h1>
      <div className={s.cardContainer}>
        {events.map((item) => (
          <EventCard key={item.id} eventInfoFromdb={item} />
        ))}
      </div>
    </div>
  );
};
