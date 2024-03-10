import { Actions } from "./const";

export const setStyleForBg = (value) => ({
  type: Actions.SET_STYLE,
  payload: value,
});
export const checkUserValid = (value) => ({
  type: Actions.CHECK_USER_VALID,
  payload: value,
});
export const checkEmailValid = (value) => ({
  type: Actions.CHECK_EMAIL_VALID,
  payload: value,
});
export const checkPassValid = (value) => ({
  type: Actions.CHECK_PASS_VALID,
  payload: value,
});
export const getUsernameValue = (value) => ({
  type: Actions.GET_USERNAME,
  payload: value,
});
export const getEmailValue = (value) => ({
  type: Actions.GET_EMAIL,
  payload: value,
});
export const getPassValue = (value) => ({
  type: Actions.GET_PASS,
  payload: value,
});
export const setError = (value) => ({
  type: Actions.SET_ERROR,
  payload: value,
});
export const setAppercaseValid = (value) => ({
  type: Actions.SET_APPERCASE_VALID,
  payload: value,
});