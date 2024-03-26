import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { EventsContext } from "../../context/eventsContext";
import { useSearchParams } from "react-router-dom";
import b from "./bookEvents.module.scss";
import { formatTime } from "../../services/formatTime";
export const BookEvent = () => {
  const { events } = useContext(EventsContext);
  const [searchParams] = useSearchParams();
  const currentEventsInfo = events?.filter(
    (item) => item.id === Number(searchParams.get("id"))
  );
  return (
    <div className={b.bookEvent_container}>
      <h1>Book your event</h1>
      {currentEventsInfo?.map((item) => (
        <div key={item.id} className={b.bookEventWrap}>
          <div className={b.infoAboutEventContainer}>
            <div className={b.infoAboutEvent}>
              <img src={item.imgurl} alt="event img" />
              <ul className={b.eventDiscription}>
                <li className={b.name}>{item.name}</li>
                <li className={b.age}>{item.age}</li>
                <li className={b.date_location}>
                  <span>Date</span>
                  <h2>{formatTime(item.startingtime)}</h2>
                </li>
                <li className={b.date_location}>
                  <span>Location</span>
                  <h2>
                    13115 135 St NW , T5L 1Y6 "Kazan Theater of the Young
                    Spectator"
                  </h2>
                </li>
              </ul>
            </div>
            <div className={b.discription}>
              <span>Discriptions about event</span>
              <p>{item.disc}</p>
            </div>
          </div>
          <div className={b.seats_block}>{item.eventseats}</div>
        </div>
      ))}
    </div>
  );
};
