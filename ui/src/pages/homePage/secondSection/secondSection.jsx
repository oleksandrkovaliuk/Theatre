import React, { useContext } from "react";
import s from "./secondSection.module.scss";
import { EventsContext } from "../../../context/EventsContext";
import { formatTime } from "../../../services/formatTime";
export const SecondSection = () => {
  const { event } = useContext(EventsContext);
  return (
    <div className={s.upcomingEvents}>
      <h1 className={s.title}>Upcoming premiers</h1>
      <div className={s.cardContainer}>
        
        {event
          ?.sort((a, b) => a.id - b.id)
          .map((item) => (
            <div key={item?.id} className={s.eventCard}>
              <div className={s.preview}>
                <img
                  style={{ borderRadius: "20px" }}
                  src={item.previeurl}
                  alt={item.name}
                />
              </div>
              <div className={s.timeAndAgeTopBlock}>
                <button className={s.eventStarting}>
                  {formatTime(item.datetime_column)}
                </button>
                <button className={s.age}>{item.age}</button>
              </div>
              <div className={s.eventNameAndDisc}>
                <div className={s.textbg} />
                <div className={s.text}>
                  <h2>{item.name}</h2>
                  <p>{item.disc}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
