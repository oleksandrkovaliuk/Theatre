import { ActionForEventCard } from "./const";

export const setChangedEvent = (value) => {
  return {
    type: ActionForEventCard.SET_CHANGED_EVENT,
    payload: value,
  };
};
export const setNewDateEvent = (value) => {
  return {
    type: ActionForEventCard.SET_NEWDATE_EVENT,
    payload: value,
  };
};
export const setNewAgeEvent = (value) => {
  return {
    type: ActionForEventCard.SET_NEWAGE_EVENT,
    payload: value,
  };
};
export const setNewNameEvent = (value) => {
  return {
    type: ActionForEventCard.SET_NEWNAME_EVENT,
    payload: value,
  };
};
export const setNewDiscEvent = (value) => {
  return {
    type: ActionForEventCard.SET_NEWDISC_EVENT,
    payload: value,
  };
};
export const setNewImgEvent = (value) => {
  return {
    type: ActionForEventCard.SET_NEWIMG_EVENT,
    payload: value,
  };
};
export const setStylesForBg = (value) => {
  return {
    type: ActionForEventCard.SET_STYLE_FOR_BG,
    payload: value,
  };
};
export const setTransformCardInEditMode = (value) => {
  return {
    type: ActionForEventCard.SET_TRANSFORM_CARD_IN_EDIT_MODE,
    payload: value,
  };
};
export const setDoubleCheckMenu = (value) => {
  return {
    type: ActionForEventCard.SET_DOUBLECHECK_MENU,
    payload: value,
  };
};
