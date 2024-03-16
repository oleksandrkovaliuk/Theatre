import React, { useEffect, useRef, useState } from "react";
import s from "./eventCard.module.scss";
import { formatTime } from "../../services/formatTime";

export const EventCard = ({
  eventInfoFromdb,
  eventInfoAge,
  eventUrlImg,
  eventStarignTime,
  eventName,
  eventDisc,
}) => {
  const ref = useRef(null);
  const [stylesForBg, setStylesForBg] = useState({});
  useEffect(() => {
    if (ref.current) {
      setStylesForBg({
        height: ref.current.getBoundingClientRect().height,
        width: ref.current.getBoundingClientRect().width,
      });
    }
  }, [ref, eventName, eventDisc, eventInfoFromdb]);
  return (
    <>
      {eventInfoFromdb ? (
        <div
          key={eventInfoFromdb?.id}
          style={{ backgroundImage: `url(${eventInfoFromdb?.imgurl})` }}
          className={s.eventCard}
        >
          <div className={s.timeAndAgeTopBlock}>
            <button className={s.eventStarting}>
              {formatTime(eventInfoFromdb?.startingtime)}
            </button>
            <button className={s.age}>{eventInfoFromdb?.age}</button>
          </div>
          <div className={s.eventNameAndDisc}>
            <div
              className={s.textbg}
              style={{
                height: `${stylesForBg.height}px`,
                width: `${stylesForBg.width}px`,
              }}
            />
            <div ref={ref} className={s.text}>
              <h2>{eventInfoFromdb?.name}</h2>
              <p>{eventInfoFromdb?.disc}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={s.eventCard}
          style={{ backgroundImage: `url(${eventUrlImg})` }}
        >
          <div className={s.timeAndAgeTopBlock}>
            <button className={s.eventStarting}>
              {formatTime(eventStarignTime)}
            </button>
            <button className={s.age}>{eventInfoAge}</button>
          </div>
          <div className={s.eventNameAndDisc}>
            <div
              className={s.textbg}
              style={{
                height: `${stylesForBg.height}px`,
                width: `${stylesForBg.width}px`,
              }}
            />
            <div ref={ref} className={s.text}>
              <h2>{eventName}</h2>
              <p>{eventDisc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
