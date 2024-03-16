import { Actions } from "./const";

export const InitialValue = {
  eventName: "",
  eventDisc: "",
  eventDate: "",
  eventAge: "",
  eventImg: "",
  checkAllField: {
    checkNameField: false,
    checkDiscField: false,
    checkDateField: false,
    checkAgeField: false,
    checkImgUploaded: false,
  },
};

export const ReducerForCreateEvent = (state, action) => {
  if (action.type === Actions.SET_EVENT_NAME) {
    return { ...state, eventName: action.payload };
  }
  if (action.type === Actions.SET_EVENT_DISC) {
    return { ...state, eventDisc: action.payload };
  }
  if (action.type === Actions.SET_EVENT_DATE) {
    return { ...state, eventDate: action.payload };
  }
  if (action.type === Actions.SET_EVENT_AGE) {
    return { ...state, eventAge: action.payload };
  }
  if (action.type === Actions.SET_EVENT_IMG) {
    return { ...state, eventImg: action.payload };
  }
  if (action.type === Actions.CHECK_NAME_FIELD) {
    return {
      ...state,
      checkAllField: {
        ...state.checkAllField,
        checkNameField: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_DISC_FIELD) {
    return {
      ...state,
      checkAllField: {
        ...state.checkAllField,
        checkDiscField: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_DATE_FIELD) {
    return {
      ...state,
      checkAllField: {
        ...state.checkAllField,
        checkDateField: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_AGE_FIELD) {
    return {
      ...state,
      checkAllField: {
        ...state.checkAllField,
        checkAgeField: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_IMG_UPLOADED) {
    return {
      ...state,
      checkAllField: {
        ...state.checkAllField,
        checkImgUploaded: action.payload,
      },
    };
  }
};
