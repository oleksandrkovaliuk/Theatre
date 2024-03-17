import React from "react";
import m from "./manegeEvents.module.scss";
import { EventCard } from "../../components/eventCard";
import { useContext } from "react";
import { EventsContext } from "../../context/eventsContext";

export const MageneEvents = () => {
  const { event } = useContext(EventsContext);
  return (
    <div className={m.manegeEvents_page}>
      <h1 className={m.manegeEvents}>Maneging your events</h1>
      <div className={m.eventsEditable}>
        {event
          ?.sort((a, b) => b.id - a.id)
          .map((item) => (
            <EventCard itemId={item.id} editAble eventInfoFromdb={item} />
          ))}
      </div>
    </div>
  );
};
