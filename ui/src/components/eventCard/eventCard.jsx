import React, { useEffect, useRef, useState } from "react";
import s from "./eventCard.module.scss";
import { formatTime } from "../../services/formatTime";
import { EditStick } from "../../icons/edit";
import { useContext } from "react";
import { NotificationContext } from "../../context/notificationContext";
import { infoAboutEventById } from "../../services/apiCallConfig";
import { CloseBold } from "../../icons/close";

export const EventCard = ({
  eventInfoFromdb,
  eventInfoAge,
  eventUrlImg,
  eventStarignTime,
  eventName,
  eventDisc,
  editAble,
  itemId,
}) => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const ref = useRef(null);
  const [stylesForBg, setStylesForBg] = useState({});
  const [editAbleCardInfo, setEditAbleCardInfo] = useState({
    // id: "",
    // name: "",
    // disc: "",
    // date: "",
    // age: "",
    // imgurl: "",
  })
  const [transformCardInEditMode, setTransformCardInEditMode] = useState(false);
  const getInfoAboutClickedEvent = async (event) => {
    const currentCardId = event.currentTarget.closest("div").getAttribute("id");
    try {
      if (currentCardId) {
        if (!transformCardInEditMode) {
          const res = await infoAboutEventById({ id: currentCardId });
          setEditAbleCardInfo(res.eventInfo);
          // id: res.eventInfo.id,
          // name: res.eventInfo.name,
          // disc: res.eventInfo.disc,
          // date: res.eventInfo.startingtime,
          // age: res.eventInfo.age,
          // imgurl: res.eventInfo.imgurl,
          // }
          setTransformCardInEditMode(true);
        } else {
          setTransformCardInEditMode(false);
        }
      }
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  const updateInfoAboutEvent = (event, inputName) => {
    const inputValue = event.currentTarget.value;
    if (inputName === "itemDate") {
      console.log(inputValue);
      if (formatTime(inputValue) !== "invalid date" && inputValue.length) {
        setEditAbleCardInfo({ startingtime: inputValue });
      } else {
        setNotificationMessage(`please follow example YYYY-MM-DD HH:MIN`);
      }
    }
  };
  useEffect(() => {
    if (ref.current) {
      setStylesForBg({
        height: ref.current.getBoundingClientRect().height,
        width: ref.current.getBoundingClientRect().width,
      });
    }
  }, [ref, eventName, eventDisc, eventInfoFromdb]);
  return (
    <div
      style={{
        backgroundImage: `url(${
          eventInfoFromdb ? eventInfoFromdb?.imgurl : eventUrlImg
        })`,
      }}
      id={itemId}
      className={s.eventCard}
    >
      {editAble && (
        <button onClick={getInfoAboutClickedEvent} className={s.editButton}>
          {transformCardInEditMode ? <CloseBold /> : <EditStick />}
        </button>
      )}
      <div className={s.timeAndAgeTopBlock}>
        {transformCardInEditMode ? (
          <input
            placeholder={formatTime(editAbleCardInfo.startingtime)}
            type="text"
            id="itemDate"
            name="itemDate"
            className={s.changeDate}
            onChange={(event) => updateInfoAboutEvent(event, "itemDate")}
          />
        ) : (
          <button className={s.eventStarting}>
            {formatTime(
              eventInfoFromdb ? eventInfoFromdb?.startingtime : eventStarignTime
            )}
          </button>
        )}
        <button className={s.age}>
          {eventInfoFromdb ? eventInfoFromdb?.age : eventInfoAge}
        </button>
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
          <h2>{eventInfoFromdb ? eventInfoFromdb?.name : eventName}</h2>
          <p>{eventInfoFromdb ? eventInfoFromdb?.disc : eventDisc}</p>
        </div>
      </div>
    </div>
  );
};
