import React, { useContext, useEffect, useState } from "react";
import m from "./manegeEvents.module.scss";
import { EventCard } from "../../components/eventCard";
import { EventsContext } from "../../context/eventsContext";
import {
  callForChangeMultipleEvents,
  callForChangeSingleEvent,
  getEvents,
} from "../../services/apiCallConfig";
import { NotificationContext } from "../../context/notificationContext";

export const MageneEvents = () => {
  const { events, setCommingEvents } = useContext(EventsContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const [changedEvents, setChangedEvents] = useState(null);
  const [checkIfSubmited, setSubmited] = useState(false);
  const showSubmitBtn = (data) => {
    setChangedEvents(data);
  };
  const submitAllChanges = async () => {
    try {
      const res =
        changedEvents.length > 1
          ? await callForChangeMultipleEvents({
              dataWithChangedEvents: changedEvents,
            })
          : await callForChangeSingleEvent({
              id: changedEvents[0].id,
              currentDate: changedEvents[0].currentDate,
              currentAge: changedEvents[0].currentAge,
              currentName: changedEvents[0].currentName,
              currentDisc: changedEvents[0].currentDisc,
              currentImg: changedEvents[0].currentImg,
              currentHall: changedEvents[0].currentHall,
            });
      const events = await getEvents();
      setCommingEvents(events);
      setNotificationMessage(res.text , "success");
      setSubmited(true);
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  useEffect(() => {
    if (!changedEvents?.length) {
      console.log(changedEvents, "events");
      setSubmited(true);
    } else {
      setSubmited(false);
    }
  }, [changedEvents]);
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
              showSubmitBtn={showSubmitBtn}
              checkIfSubmited={checkIfSubmited}
            />
          ))}
      </div>
      <button
        className={m.submitAllChanges}
        style={
          changedEvents && !checkIfSubmited
            ? { bottom: "3%" }
            : { bottom: "-100%" }
        }
        onClick={submitAllChanges}
      >
        Submit changes
      </button>
    </div>
  );
};
