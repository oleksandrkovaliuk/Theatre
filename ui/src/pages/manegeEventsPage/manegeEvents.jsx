import React, { useContext, useEffect, useState } from "react";
import m from "./manegeEvents.module.scss";
import { EventCard } from "../../components/eventCard";
import { NotificationContext } from "../../context/notificationContext";
import { useDispatch, useSelector } from "react-redux";
import {
  changeMultipleEvents,
  changeSingleEvent,
} from "../../store/thunks/events";

export const MageneEvents = () => {
  const dispatch = useDispatch();

  const { events } = useSelector((state) => ({
    events: state.events.list,
  }));

  const { setNotificationMessage } = useContext(NotificationContext);

  const [changedEvents, setChangedEvents] = useState([]);
  const [checkIfSubmited, setSubmited] = useState(false);

  const handleChangeEvent = (updatedData, itemId) => {
    setChangedEvents((prevState) => {
      if (!prevState.length) {
        return [updatedData];
      }

      const findItem = prevState.find((event) => event.id === itemId);

      if (findItem) {
        return prevState.map((event) => {
          if (event.id === itemId) {
            return updatedData;
          }
          return event;
        });
      } else {
        return [...prevState, updatedData];
      }
    });
  };

  const submitAllChanges = async () => {
    try {
      const res =
        changedEvents.length > 1
          ? await dispatch(changeMultipleEvents(changedEvents)).unwrap()
          : await dispatch(
              changeSingleEvent({
                id: changedEvents[0].id,
                currentDate: changedEvents[0].currentDate,
                currentAge: changedEvents[0].currentAge,
                currentName: changedEvents[0].currentName,
                currentDisc: changedEvents[0].currentDisc,
                currentImg: changedEvents[0].currentImg,
                currentHall: changedEvents[0].currentHall,
              })
            ).unwrap();
      setNotificationMessage(res.text, "success");
      setSubmited(true);

      setChangedEvents([]);
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
          ?.map((item) => item)
          ?.sort((a, b) => b.id - a.id)
          .map((item) => (
            <EventCard
              editAble
              key={item.id}
              itemId={item.id}
              eventInfoFromdb={item}
              checkIfSubmited={checkIfSubmited}
              handleChangeEvent={handleChangeEvent}
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
