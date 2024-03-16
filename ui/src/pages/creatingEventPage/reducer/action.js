import { Actions } from "./const";

export const setEventName = (value) => ({
  type: Actions.SET_EVENT_NAME,
  payload: value,
});
export const setEventDisc = (value) => ({
  type: Actions.SET_EVENT_DISC,
  payload: value,
});
export const setEventDate = (value) => ({
  type: Actions.SET_EVENT_DATE,
  payload: value,
});
export const setEventAge = (value) => ({
  type: Actions.SET_EVENT_AGE,
  payload: value,
});
export const setEventImg = (value) => ({
  type: Actions.SET_EVENT_IMG,
  payload: value,
});
export const checkNameField = (value) => ({
  type: Actions.CHECK_NAME_FIELD,
  payload: value,
});
export const checkDiscField = (value) => ({
  type: Actions.CHECK_DISC_FIELD,
  payload: value,
});
export const checkDateField = (value) => ({
  type: Actions.CHECK_DATE_FIELD,
  payload: value,
});
export const checkAgeField = (value) => ({
  type: Actions.CHECK_AGE_FIELD,
  payload: value,
});
export const checkImgUploaded = (value) => ({
  type: Actions.CHECK_IMG_UPLOADED,
  payload: value,
});
