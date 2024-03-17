import React, { useContext } from "react";
import m from "./manegeEvents.module.scss";
import { EventCard } from "../../components/eventCard";
import { EventsContext } from "../../context/eventsContext";

export const MageneEvents = () => {
  const { events } = useContext(EventsContext);
  return (
    <div className={m.manegeEvents_page}>
      <h1 className={m.manegeEvents}>Maneging your events</h1>
      <div className={m.eventsEditable}>
        {events
          ?.sort((a, b) => b.id - a.id)
          .map((item) => (
            <EventCard
              editAble
              key={item.id}
              itemId={item.id}
              eventInfoFromdb={item}
            />
          ))}
      </div>
    </div>
  );
};
