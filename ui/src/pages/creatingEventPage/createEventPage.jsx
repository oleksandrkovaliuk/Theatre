import React, { useContext, useEffect, useReducer } from "react";
import c from "./createPage.module.scss";
import { InitialValue, ReducerForCreateEvent } from "./reducer/reducer";
import {
  setEventAge,
  setEventDate,
  setEventDisc,
  setEventImg,
  setEventName,
  checkNameField,
  checkDiscField,
  checkDateField,
  checkAgeField,
  checkImgUploaded,
  setTypeOfHall,
  setHallSeats,
  checkHallField,
} from "./reducer/action";
import { EventCard } from "../../components/eventCard";
import { formatTime } from "../../services/formatTime";
import { creatingEvent, getEvents } from "../../services/apiCallConfig";
import { NotificationContext } from "../../context/notificationContext";
import { useNavigate } from "react-router-dom";
import { uploadEventImg } from "../../services/uploadingEventsImgs";
import { functionSetUpSeats } from "../../services/hallSeatsArraysForDB";
import { EventsContext } from "../../context/eventsContext";
export const CreateEventPage = () => {
  const navigate = useNavigate();

  const { setNotificationMessage } = useContext(NotificationContext);
  const { setCommingEvents } = useContext(EventsContext);
  const [
    {
      checkAllField,
      eventName,
      eventDisc,
      eventDate,
      eventAge,
      eventImg,
      hallSeats,
      typeOfHall,
    },
    dispathAction,
  ] = useReducer(ReducerForCreateEvent, InitialValue);
  const setUpEventInfo = (event, fieldName) => {
    const inputValue = event.target.value;
    if (fieldName === "setEventName") {
      if (inputValue?.length >= 4) {
        dispathAction(checkNameField(true));
      } else {
        dispathAction(checkNameField(false));
      }
      dispathAction(setEventName(inputValue));
    }
    if (fieldName === "setEventDisc") {
      if (inputValue?.length >= 20) {
        dispathAction(checkDiscField(true));
      } else {
        dispathAction(checkDiscField(false));
      }
      dispathAction(setEventDisc(inputValue));
    }
    if (fieldName === "setEventDate") {
      if (
        formatTime(inputValue) !== "invalid date" &&
        inputValue.length >= 15
      ) {
        dispathAction(checkDateField(true));
      } else {
        dispathAction(checkDateField(false));
      }
      dispathAction(setEventDate(inputValue));
    }
    if (fieldName === "setEventAge") {
      if (inputValue.length >= 3) {
        dispathAction(checkAgeField(true));
      } else {
        dispathAction(checkAgeField(false));
      }
      dispathAction(setEventAge(inputValue));
    }
    if (fieldName === "setHallEvent") {
      const setUpSeats = functionSetUpSeats(inputValue);
      if (setUpSeats) {
        dispathAction(setTypeOfHall(inputValue));
        dispathAction(setHallSeats(setUpSeats));
        dispathAction(checkHallField(true));
      } else {
        dispathAction(checkHallField(false));
      }
    }
  };
  const handleUploadingImg = async (event) => {
    try {
      const resUrl = await uploadEventImg(event, eventName);
      if (resUrl.url) {
        dispathAction(setEventImg(resUrl.url));
        dispathAction(checkImgUploaded(true));
        setNotificationMessage(resUrl.message, "success");
      } else {
        setNotificationMessage(resUrl.message, "warning");
      }
    } catch (error) {
      dispathAction(checkImgUploaded(false));
      setNotificationMessage(error);
    }
  };
  const submitCreatingEvent = async (event) => {
    event.preventDefault();
    try {
      const res = await creatingEvent({
        eventName: eventName,
        eventDisc: eventDisc,
        eventDate: eventDate,
        eventAge: eventAge,
        eventImg: eventImg,
        hall: typeOfHall,
        eventseats: hallSeats,
      });
      setNotificationMessage(res.succesfull, "success");

      const events = await getEvents();
      setCommingEvents(events);

      navigate("/");
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  useEffect(() => {
    if (!eventName.length) {
      dispathAction(setEventName("name"));
    }
    if (!eventDisc.length) {
      dispathAction(setEventDisc("disc"));
    }
    if (!eventDate.length) {
      dispathAction(setEventDate(formatTime(new Date())));
    }
    if (!eventAge.length) {
      dispathAction(setEventAge("00+"));
    }
  }, [eventName, eventDisc, eventDate, eventAge, eventImg]);

  const isDisabledSubmitBtn =
    checkAllField.checkNameField &&
    checkAllField.checkDiscField &&
    checkAllField.checkDateField &&
    checkAllField.checkAgeField &&
    checkAllField.checkImgUploaded &&
    checkAllField.checkHallField;

  return (
    <div className={c.createEventSection}>
      <form className={c.formToCreateEvent}>
        <div className={c.creatingTool}>
          <h1 className={c.title}>Set up your Event</h1>
          <div className={c.inputsWrap}>
            <input
              placeholder=" "
              type="text"
              id="eventName"
              name="eventName"
              className={c.eventInfoInput}
              onChange={(event) => setUpEventInfo(event, "setEventName")}
            />
            <label htmlFor="eventName" className={c.eventInfoLabel}>
              Event name
            </label>
            {!checkAllField.checkNameField && (
              <p className={c.notes}>
                name should be longer then <b>4 chapters</b>
              </p>
            )}
          </div>
          <div className={c.inputsWrap}>
            <textarea
              placeholder=" "
              type="text"
              id="eventDisc"
              name="eventDisc"
              className={c.discTextArea}
              onChange={(event) => setUpEventInfo(event, "setEventDisc")}
            ></textarea>
            <label htmlFor="eventDisc" className={c.discLabel}>
              Event Discription
            </label>
            {!checkAllField.checkDiscField && (
              <p className={c.notes}>
                discribtion should be longer then<b> 20 chapters</b>
              </p>
            )}
          </div>
          <div className={c.inputsWrap}>
            <input
              placeholder=" "
              type="datetime-local"
              id="eventDate"
              name="eventDate"
              className={c.eventInfoInput}
              onChange={(event) => setUpEventInfo(event, "setEventDate")}
            ></input>
            <label htmlFor="eventDate" className={c.eventInfoLabel}>
              Event date
            </label>
            {!checkAllField.checkDateField && (
              <p className={c.notes}>
                Please follow the example<b> "yyyy-mm-dd hh:mm"</b>
              </p>
            )}
          </div>
          <div className={c.inputsWrap}>
            <input
              placeholder=" "
              type="text"
              id="age"
              name="age"
              className={c.eventInfoInput}
              onChange={(event) => setUpEventInfo(event, "setEventAge")}
            ></input>
            <label htmlFor="age" className={c.eventInfoLabel}>
              For wich age category this event is
            </label>
            {!checkAllField.checkAgeField && (
              <p className={c.notes}>
                Please follow the example<b> "14+"</b>
              </p>
            )}
          </div>
          <div className={c.choseTheHall}>
            <label htmlFor="selectTheHallForEvent">
              Select hall which you wanna use for this event
              <select
                id="selectTheHallForEvent"
                onChange={(event) => setUpEventInfo(event, "setHallEvent")}
                name="halls"
              >
                <option disabled={true && typeOfHall} value="">
                  Select a hall
                </option>
                <option value="sml">Small hall(26 person)</option>
                <option value="big">Big hall(52 person)</option>
              </select>
            </label>
          </div>
          <div className={c.uploadImgWrap}>
            <label
              style={
                eventName === "name"
                  ? { opacity: "0.5", pointerEvents: "none" }
                  : { opacity: "1", pointerEvents: "unset" }
              }
              htmlFor="uploadingimgEvent"
              className={c.uploadingImgBtn}
            >
              <input
                type="file"
                id="uploadingimgEvent"
                name="uploadingimgEvent"
                className={c.eventInfoInput}
                onChange={handleUploadingImg}
              />
              Upload img for your event
            </label>
          </div>
        </div>
        <button
          disabled={!isDisabledSubmitBtn}
          style={isDisabledSubmitBtn ? { bottom: "5%" } : { bottom: "-100%" }}
          className={c.submitChanges}
          onClick={submitCreatingEvent}
        >
          Create new event
        </button>
      </form>
      <div className={c.previewView}>
        <EventCard
          eventName={eventName}
          eventDisc={eventDisc}
          eventStarignTime={eventDate}
          eventInfoAge={eventAge}
          eventUrlImg={
            !eventImg?.length
              ? "https://firebasestorage.googleapis.com/v0/b/theater-53375.appspot.com/o/eventsImgs%2FdefaultImg%2F507863-1847246849.jpg?alt=media&token=bc8c8d88-3a03-4a38-8e06-56f0c4b24a94"
              : eventImg
          }
        />
      </div>
    </div>
  );
};
