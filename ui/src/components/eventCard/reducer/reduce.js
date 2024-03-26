import { ActionForEventCard } from "./const";

export const InitState = {
  changedEvents: [],
  updatedDate: "",
  updatedAge: "",
  updatedName: "",
  updatedDisc: "",
  updatedImg: "",
  stylesForBg: {},
  transformCardInEditMode: false,
  doubleCheckMenu: false,
  showBookEvent: false,
};
export const reducer = (state, action) => {
  if (action.type === ActionForEventCard.SET_CHANGED_EVENT) {
    return {
      ...state,
      changedEvents: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_NEWDATE_EVENT) {
    return {
      ...state,
      updatedDate: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_NEWAGE_EVENT) {
    return {
      ...state,
      updatedAge: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_NEWNAME_EVENT) {
    return {
      ...state,
      updatedName: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_NEWDISC_EVENT) {
    return {
      ...state,
      updatedDisc: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_NEWIMG_EVENT) {
    return {
      ...state,
      updatedImg: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_STYLE_FOR_BG) {
    return {
      ...state,
      stylesForBg: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_TRANSFORM_CARD_IN_EDIT_MODE) {
    return {
      ...state,
      transformCardInEditMode: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SET_DOUBLECHECK_MENU) {
    return {
      ...state,
      doubleCheckMenu: action.payload,
    };
  }
  if (action.type === ActionForEventCard.SHOW_BOOK_EVENT_BUTTON) {
    return {
      ...state,
      showBookEvent: action.payload,
    };
  }
};
