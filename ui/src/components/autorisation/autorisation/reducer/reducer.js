import { Actions } from "./const";

export const InitialStates = {
  blurBgStyle: {},
  userValid: false,
  emailValid: false,
  passValid: false,
  userNameValue: null,
  emailValue: null,
  passValue: null,
  errore: null,
  passwordCheck: {
    uppercase: false,
    lowercase: false,
    passlength: false,
    specialSign: false,
    number: false,
  },
};

export const reducerForAutorisation = (state, action) => {
  if (action.type === Actions.SET_STYLE) {
    return {
      ...state,
      blurBgStyle: action.payload,
    };
  }
  if (action.type === Actions.CHECK_USER_VALID) {
    return {
      ...state,
      userValid: action.payload,
    };
  }
  if (action.type === Actions.CHECK_EMAIL_VALID) {
    return {
      ...state,
      emailValid: action.payload,
    };
  }
  if (action.type === Actions.CHECK_PASS_VALID) {
    return {
      ...state,
      passValid: action.payload,
    };
  }
  if (action.type === Actions.GET_USERNAME) {
    return {
      ...state,
      userNameValue: action.payload,
    };
  }
  if (action.type === Actions.GET_EMAIL) {
    return {
      ...state,
      emailValue: action.payload,
    };
  }
  if (action.type === Actions.GET_PASS) {
    return {
      ...state,
      passValue: action.payload,
    };
  }
  if (action.type === Actions.CHECK_PASSWORD_ON_UPPERCASE) {
    return {
      ...state,
      passwordCheck: {
        ...state.passwordCheck,
        uppercase: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_PASSWORD_ON_LOWERCASE) {
    return {
      ...state,
      passwordCheck: {
        ...state.passwordCheck,
        lowercase: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_PASSWORD_ON_SPECIAL_SIGNS) {
    return {
      ...state,
      passwordCheck: {
        ...state.passwordCheck,
        specialSign: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_PASSWORD_LENGTH) {
    return {
      ...state,
      passwordCheck: {
        ...state.passwordCheck,
        passlength: action.payload,
      },
    };
  }
  if (action.type === Actions.CHECK_PASSWORD_ON_NUMBER) {
    return {
      ...state,
      passwordCheck: {
        ...state.passwordCheck,
        number: action.payload,
      },
    };
  }
};
