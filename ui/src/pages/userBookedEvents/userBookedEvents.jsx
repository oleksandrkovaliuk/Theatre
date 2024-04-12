import React, { useCallback, useContext, useEffect, useState } from "react";
import u from "./userBookedEvents.module.scss";
import { checkLoginned, getEvents } from "../../services/apiCallConfig";
import { NotificationContext } from "../../context/notificationContext";

export const UserBookedEvents = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const [listOfBookedEvents, setListOfBookedEvents] = useState(null);
  const createListOfBookedEvent = (user, events) => {
    const resultArr = events.reduce((acc, event) => {
      const bookedSeats = JSON.parse(event.eventseats).filter(
        (item) =>
          item.bokker === user.email && item.booked && item.ticket.length > 0
      );
      if (bookedSeats.length > 0) {
        acc.push({
          eventName: event.name,
          eventDisc: event.disc,
          eventAge: event.age,
          eventImg: event.imgurl,
          bookedSeats: bookedSeats.map((seat) => {
            return {
              seats: seat.id + seat.letter,
              tickets: seat.ticket,
            };
          }),
        });
      }
      return acc;
    }, []);
    return setListOfBookedEvents(resultArr);
  };
  const getListOfBookedEventsByUser = useCallback(async () => {
    try {
      const [user, events] = await Promise.all([checkLoginned(), getEvents()]);
      createListOfBookedEvent(user, events);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage]);
  useEffect(() => {
    getListOfBookedEventsByUser();
  }, [getListOfBookedEventsByUser]);
  return (
    <div className={u.user}>
      {listOfBookedEvents?.map((item) => (
        <div key={item.name}>
          {item.eventName}
          {item.bookedSeats.map((seat) => (
            <>
              <p key={seat.seats}>{seat.seats}</p>
              <img style={{ width: "200px" }} src={seat.tickets} alt="ticket" />
            </>
          ))}
        </div>
      ))}
    </div>
  );
};
