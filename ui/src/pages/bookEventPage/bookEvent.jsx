import React from "react";
import { useContext } from "react";
import { EventsContext } from "../../context/eventsContext";
import { useSearchParams } from "react-router-dom";
import { formatTime } from "../../services/formatTime";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import b from "./bookEvents.module.scss";
const initialScale = window.innerWidth < 1000 ? 0.4 : 1;
export const BookEvent = () => {
  const { events } = useContext(EventsContext);
  const [searchParams] = useSearchParams();
  const currentEventsInfo = events?.filter(
    (item) => item.id === Number(searchParams.get("id"))
  );
  console.log(
    currentEventsInfo?.map((item) => JSON.parse(item.eventseats).length)
  );
  return (
    <div className={b.bookEvent_container}>
      <h1>Book your event</h1>
      {currentEventsInfo?.map((item) => {
        const parsedSeats = JSON.parse(item.eventseats);
        return (
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
            </div>{" "}
            <TransformWrapper initialScale={0.4}>
              <TransformComponent>
                <div className={b.seats_block}>
                  <div className={b.screenFormContainer}>
                    <span>Stage</span>
                  </div>
                  <div className={b.seats}>
                    <div className={b.seatRow}>
                      {parsedSeats.slice(0, 6).map((item) => {
                        return (
                          <div
                            key={item.id}
                            style={
                              item.booked
                                ? {
                                    backgroundColor: "var(--color-red)",
                                    pointerEvents: "none",
                                  }
                                : {
                                    backgroundColor: "var(--color-lightgray)",
                                    pointerEvents: "unset",
                                  }
                            }
                            className={b.seat}
                          >
                            <span>
                              {item.id}
                              {item.letter}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className={b.seatRow}>
                      {parsedSeats
                        .slice(6, parsedSeats.length - 4)
                        .map((item) => {
                          return (
                            <div
                              key={item.id}
                              style={
                                item.booked
                                  ? {
                                      backgroundColor: "var(--color-red)",
                                      pointerEvents: "none",
                                    }
                                  : {
                                      backgroundColor: "var(--color-lightgray)",
                                      pointerEvents: "unset",
                                    }
                              }
                              className={b.seat}
                            >
                              <span>
                                {item.id}
                                {item.letter}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                    <div className={b.seatRow}>
                      {parsedSeats
                        .slice(parsedSeats.length - 4, parsedSeats.length)
                        .map((item) => {
                          return (
                            <div
                              key={item.id}
                              style={
                                item.booked
                                  ? {
                                      backgroundColor: "var(--color-red)",
                                      pointerEvents: "none",
                                    }
                                  : {
                                      backgroundColor: "var(--color-lightgray)",
                                      pointerEvents: "unset",
                                    }
                              }
                              className={b.seat}
                            >
                              <span>
                                {item.id}
                                {item.letter}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
        );
      })}
      <div className={b.submitBookedSeats}></div>
    </div>
  );
};
