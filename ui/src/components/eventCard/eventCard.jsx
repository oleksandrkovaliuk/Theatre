import React, { useEffect, useRef, useState } from "react";
import s from "./eventCard.module.scss";
import { formatTime } from "../../services/formatTime";
import { EditStick } from "../../icons/edit";
import { useContext } from "react";
import { NotificationContext } from "../../context/notificationContext";
import { infoAboutEventById } from "../../services/apiCallConfig";
import { CloseBold } from "../../icons/close";
import { Download } from "../../icons/download";

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
  const [editAbleCardInfo, setEditAbleCardInfo] = useState({});
  const [transformCardInEditMode, setTransformCardInEditMode] = useState(false);
  const getInfoAboutClickedEvent = async (event) => {
    const currentCardId = event.currentTarget.closest("div").getAttribute("id");
    try {
      if (currentCardId) {
        if (!transformCardInEditMode) {
          const res = await infoAboutEventById({ id: currentCardId });
          setEditAbleCardInfo(res.eventInfo);
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
  }, [ref, eventName, eventDisc, eventInfoFromdb, transformCardInEditMode]);
  return (
    <div
      style={{
        backgroundImage: `url(${
          eventInfoFromdb ? eventInfoFromdb?.imgurl : eventUrlImg
        })`,
        border: transformCardInEditMode ? "2px solid var(--color-red)" : "none",
      }}
      id={itemId}
      className={s.eventCard}
    >
      {editAble && (
        <button onClick={getInfoAboutClickedEvent} className={s.editButton}>
          {transformCardInEditMode ? <CloseBold /> : <EditStick />}
        </button>
      )}
      {transformCardInEditMode && (
        <label className={s.uploadImg}>
          <input type="file" id="uploadImg" name="uploadImg" />
          <Download />
        </label>
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
        {transformCardInEditMode ? (
          <input
            placeholder={editAbleCardInfo.age}
            type="text"
            id="itemAge"
            name="itemAge"
            className={s.changeAge}
            onChange={(event) => updateInfoAboutEvent(event, "itemAge")}
          />
        ) : (
          <button className={s.age}>
            {eventInfoFromdb ? eventInfoFromdb?.age : eventInfoAge}
          </button>
        )}
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
          {transformCardInEditMode ? (
            <input
              placeholder={editAbleCardInfo.name}
              type="text"
              id="itemName"
              name="itemName"
              className={s.changeName}
              onChange={(event) => updateInfoAboutEvent(event, "itemName")}
            />
          ) : (
            <h2>{eventInfoFromdb ? eventInfoFromdb?.name : eventName}</h2>
          )}
          {transformCardInEditMode ? (
            <input
              placeholder={editAbleCardInfo.disc}
              type="text"
              id="itemDisc"
              name="itemDisc"
              className={s.changeName}
              onChange={(event) => updateInfoAboutEvent(event, "itemDisc")}
            />
          ) : (
            <p>{eventInfoFromdb ? eventInfoFromdb?.disc : eventDisc}</p>
          )}
        </div>
      </div>
    </div>
  );
};
