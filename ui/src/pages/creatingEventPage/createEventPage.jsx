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
} from "./reducer/action";
import { EventCard } from "../../components/eventCard";
import { fbStorage } from "../../firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { formatTime } from "../../services/formatTime";
import { creatingEvent } from "../../services/apiCallConfig";
import { NotificationContext } from "../../context/notificationContext";
import { useNavigate } from "react-router-dom";
import { validationOnImgType } from "../../services/validateImgType";
import { uploadEventImg } from "../../services/uploadingEventsImgs";
export const CreateEventPage = () => {
  const navigate = useNavigate();

  const { setNotificationMessage } = useContext(NotificationContext);
  const [
    { checkAllField, eventName, eventDisc, eventDate, eventAge, eventImg },
    dispathAction,
  ] = useReducer(ReducerForCreateEvent, InitialValue);
  // const pathToEventFolder = ref(fbStorage, `eventsImgs/${eventName}/`);
  // const pathToDefaulImg = ref(fbStorage, "eventsImgs/defaultImg");
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
      console.log(formatTime(inputValue));
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
        console.log("false");
        dispathAction(checkAgeField(false));
      }
      dispathAction(setEventAge(inputValue));
    }
  };
  const handleUploadingImg = async (event) => {
    try {
      const resUrl = await uploadEventImg(event, eventName);
      dispathAction(setEventImg(resUrl));
      dispathAction(checkImgUploaded(true));
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
      });
      // setCommingEvents();

      setNotificationMessage(res.succesfull);
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
    checkAllField.checkImgUploaded;

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
            ></input>
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
