import React, { useEffect, useRef, useContext, useReducer } from "react";
import s from "./eventCard.module.scss";
import { formatTime } from "../../services/formatTime";
import { EditStick } from "../../icons/edit";
import { NotificationContext } from "../../context/notificationContext";
import { CloseBold } from "../../icons/close";
import { Download } from "../../icons/download";
import { InitState, reducer } from "./reducer/reduce";
import {
  setChangedEvent,
  setNewDateEvent,
  setNewAgeEvent,
  setNewNameEvent,
  setNewDiscEvent,
  setNewImgEvent,
  setStylesForBg,
  setTransformCardInEditMode,
  setDoubleCheckMenu,
  setBookEventButton,
} from "./reducer/action";
import { SaveChanges } from "../../icons/saveChanges";
import { Bin } from "../../icons/bid";
import { Error } from "../../icons/error";
import { uploadEventImg } from "../../services/uploadingEventsImgs";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../../store/thunks/events";

export const EventCard = ({
  eventInfoFromdb,
  eventInfoAge,
  eventUrlImg,
  eventStarignTime,
  eventName,
  eventDisc,
  editAble,
  itemId,
  handleChangeEvent,
}) => {
  const [
    {
      updatedDate,
      updatedAge,
      updatedName,
      updatedDisc,
      updatedImg,
      stylesForBg,
      transformCardInEditMode,
      doubleCheckMenu,
      showBookEvent,
    },
    dispathAction,
  ] = useReducer(reducer, InitState);
  const dispatch = useDispatch();
  const { setNotificationMessage } = useContext(NotificationContext);
  const ref = useRef(null);

  const isInputsChanged =
    updatedDate.length ||
    updatedAge.length ||
    updatedName.length ||
    updatedDisc.length ||
    updatedImg.length;

  const getInfoAboutClickedEvent = () => {
    try {
      if (itemId) {
        if (!transformCardInEditMode) {
          dispathAction(setTransformCardInEditMode(true));
        } else {
          if (isInputsChanged) {
            setNotificationMessage("your changes saved", "succes");
          }
          dispathAction(setTransformCardInEditMode(false));
        }
      }
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  const updateInfoAboutEvent = (event, inputName) => {
    const inputValue = event.currentTarget.value;
    if (inputName === "itemDate") {
      if (formatTime(inputValue) !== "invalid date" && inputValue.length) {
        dispathAction(setNewDateEvent(inputValue));
      } else {
        setNotificationMessage(
          `please follow example YYYY-MM-DD HH:MIN`,
          "warning"
        );
      }
    }
    if (inputName === "itemAge") {
      const checkFieldValid = /^\d+\+$/;
      if (inputValue.length <= 3 && checkFieldValid.test(inputValue)) {
        dispathAction(setNewAgeEvent(inputValue));
      } else {
        setNotificationMessage(`please follow example "00+`, "warning");
      }
    }
    if (inputName === "itemName") {
      if (inputValue.length > 4) {
        dispathAction(setNewNameEvent(inputValue));
      } else {
        setNotificationMessage(
          "name should contain at least 4 chapters",
          "warning"
        );
      }
    }
    if (inputName === "itemDisc") {
      if (inputValue.length > 20) {
        dispathAction(setNewDiscEvent(inputValue));
      } else {
        setNotificationMessage(
          "discription should contain at least 20 chapters",
          "warning"
        );
      }
    }
  };
  const functionForInsertChangedEvent = () => {
    const updatedData = {
      id: itemId,
      currentDate: updatedDate.length
        ? updatedDate
        : eventInfoFromdb.startingtime,
      currentAge: updatedAge.length ? updatedAge : eventInfoFromdb.age,
      currentName: updatedName.length ? updatedName : eventInfoFromdb.name,
      currentDisc: updatedDisc.length ? updatedDisc : eventInfoFromdb.disc,
      currentImg: updatedImg.length ? updatedImg : eventInfoFromdb.imgurl,
      currentHallInfo: eventInfoFromdb.hall,
      currentHall: eventInfoFromdb.eventseats,
    };

    dispathAction(setTransformCardInEditMode(false));
    handleChangeEvent(updatedData, itemId);
  };

  const showDoubleCheckMenuForDeleting = () => {
    dispathAction(setDoubleCheckMenu(true));
  };

  const handleDeclineDeleting = () => {
    console.log("declined");
    dispathAction(setDoubleCheckMenu(false));
    setNotificationMessage(
      `deleting event "${eventInfoFromdb?.name}" declined`,
      "info"
    );
  };

  const handleDeletingEvent = async () => {
    try {
      await dispatch(deleteEvent({ id: eventInfoFromdb.id })).unwrap();
      dispathAction(setDoubleCheckMenu(false));
      setNotificationMessage(
        `event "${eventInfoFromdb?.name}" succesfully deleted`,
        "success"
      );
    } catch (error) {
      setNotificationMessage(error);
    }
  };

  const handleSubmitChangedInput = () => {
    if (isInputsChanged) {
      functionForInsertChangedEvent();
    }
    dispathAction(setTransformCardInEditMode(false));
  };

  const handleUploadingImg = async (event) => {
    try {
      const resUrl = await uploadEventImg(event, eventInfoFromdb.name);
      if (resUrl.url) {
        dispathAction(setNewImgEvent(resUrl.url));
      }
      setNotificationMessage(resUrl.message, "success");
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  const handleShowBookEvents = () => {
    dispathAction(setBookEventButton(true));
  };
  const handleCloseBookEvents = () => {
    dispathAction(setBookEventButton(false));
  };
  // Block scroll on opened double check menu
  useEffect(() => {
    const body = document.body;
    if (doubleCheckMenu) {
      body.classList.add("disable-scroll-page");
    }
    return () => {
      body.classList.remove("disable-scroll-page");
    };
  }, [doubleCheckMenu]);
  // Handling changing eventCard Text Background on text changes
  useEffect(() => {
    if (ref.current) {
      dispathAction(
        setStylesForBg({
          height: ref.current.getBoundingClientRect().height,
          width: ref.current.getBoundingClientRect().width,
        })
      );
    }
  }, [ref, eventName, eventDisc, eventInfoFromdb, transformCardInEditMode]);
  return (
    <>
      {editAble && transformCardInEditMode && (
        <div onClick={handleSubmitChangedInput} className={s.background} />
      )}
      {doubleCheckMenu && (
        <div className={s.doubleCheckMenu}>
          <Error />
          <div className={s.doubleCheckQuestion}>
            <h1>
              Are you sure you wanna delete event "{eventInfoFromdb?.name}"?
            </h1>
            <div className={s.doubleCheckButtons}>
              <button onClick={handleDeletingEvent}>Delete</button>
              <button onClick={handleDeclineDeleting}>Decline</button>
            </div>
          </div>
        </div>
      )}
      <div
        className={s.eventCardContainer}
        onMouseOver={!editAble && eventInfoFromdb ? handleShowBookEvents : null}
        onMouseOut={!editAble && eventInfoFromdb ? handleCloseBookEvents : null}
      >
        {showBookEvent && (
          <NavLink to={`/bookEvent?id=${eventInfoFromdb?.id}`}>
            <button className={s.bookEventButton}>Book event</button>
          </NavLink>
        )}
        <div
          style={{
            backgroundImage: `url(${
              updatedImg.length
                ? updatedImg
                : eventInfoFromdb
                ? eventInfoFromdb?.imgurl
                : eventUrlImg
            })`,
            border: transformCardInEditMode
              ? "2px solid var(--color-red)"
              : "2px solid transparent",
            transform:
              transformCardInEditMode || showBookEvent
                ? "translateY(-30px)"
                : "translateY(0px)",
            zIndex: transformCardInEditMode && 3,
            cursor: transformCardInEditMode && "unset",
          }}
          id={itemId}
          className={s.eventCard}
        >
          {editAble && (
            <>
              <button
                type="button"
                onClick={getInfoAboutClickedEvent}
                className={s.editButton}
              >
                {transformCardInEditMode ? (
                  isInputsChanged ? (
                    <SaveChanges clickAction={handleSubmitChangedInput} />
                  ) : (
                    <CloseBold />
                  )
                ) : (
                  <EditStick />
                )}
              </button>
              {transformCardInEditMode && (
                <button
                  type="button"
                  onClick={showDoubleCheckMenuForDeleting}
                  className={s.deleteButton}
                >
                  <Bin />
                </button>
              )}
            </>
          )}
          {transformCardInEditMode && (
            <label className={s.uploadImg}>
              <input
                type="file"
                onChange={handleUploadingImg}
                id="uploadImg"
                name="uploadImg"
              />
              <Download />
            </label>
          )}
          <div className={s.timeAndAgeTopBlock}>
            {transformCardInEditMode ? (
              <input
                placeholder={formatTime(
                  updatedDate.length
                    ? updatedDate
                    : eventInfoFromdb.startingtime
                )}
                type="datetime-local"
                id="itemDate"
                name="itemDate"
                className={s.changeDate}
                onChange={(event) => updateInfoAboutEvent(event, "itemDate")}
              />
            ) : (
              <button className={s.eventStarting}>
                {formatTime(
                  updatedDate.length
                    ? updatedDate
                    : eventInfoFromdb
                    ? eventInfoFromdb?.startingtime
                    : eventStarignTime
                )}
              </button>
            )}
            {transformCardInEditMode ? (
              <input
                placeholder={
                  updatedAge.length ? updatedAge : eventInfoFromdb.age
                }
                type="text"
                id="itemAge"
                name="itemAge"
                className={s.changeAge}
                onChange={(event) => updateInfoAboutEvent(event, "itemAge")}
              />
            ) : (
              <button className={s.age}>
                {updatedAge.length
                  ? updatedAge
                  : eventInfoFromdb
                  ? eventInfoFromdb?.age
                  : eventInfoAge}
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
                  placeholder={
                    updatedName.length ? updatedName : eventInfoFromdb.name
                  }
                  type="text"
                  id="itemName"
                  name="itemName"
                  className={s.changeName}
                  onChange={(event) => updateInfoAboutEvent(event, "itemName")}
                />
              ) : (
                <h2>
                  {updatedName.length
                    ? updatedName
                    : eventInfoFromdb
                    ? eventInfoFromdb?.name
                    : eventName}
                </h2>
              )}
              {transformCardInEditMode ? (
                <input
                  placeholder={
                    updatedDisc.length ? updatedDisc : eventInfoFromdb.disc
                  }
                  type="text"
                  id="itemDisc"
                  name="itemDisc"
                  className={s.changeDisc}
                  onChange={(event) => updateInfoAboutEvent(event, "itemDisc")}
                />
              ) : (
                <p>
                  {updatedDisc.length
                    ? updatedDisc
                    : eventInfoFromdb
                    ? eventInfoFromdb?.disc
                    : eventDisc}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
