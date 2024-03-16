import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import a from "./autorisation.module.scss";
import { emailValidation } from "../../../services/emailValidation";
import { passwordValidation } from "../../../services/passwordValidation";
import { InitialStates, reducerForAutorisation } from "./reducer/reducer";
import {
  checkEmailValid,
  checkPassValid,
  checkUserValid,
  getEmailValue,
  getPassValue,
  getUsernameValue,
  setStyleForBg,
  checkPasswordONumber,
  checkPasswordOnLength,
  checkPasswordOnSpecialSign,
  checkPasswordOnLowerCase,
  checkPasswordOnUpperCase,
} from "./reducer/action";
import { logIn, signInUser } from "../../../services/apiCallConfig";
import { RedDoneIcon } from "../../../icons/redDoneIcon";
import { userContext } from "../../../context/userInfoContext";
import {
  testOnLowerCase,
  testOnNumber,
  testOnSpecialCharacters,
  testOnUpperCase,
} from "../../../utilitis/patterForCheckPass";
import { NotificationContext } from "../../../context/notificationContext";
export const AutorisationMenu = ({ show, signIn, closeMenu }) => {
  const { user, setUserInfo } = useContext(userContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const [
    {
      blurBgStyle,
      userValid,
      emailValid,
      userNameValue,
      emailValue,
      passValue,
      passwordCheck,
    },
    dispathAction,
  ] = useReducer(reducerForAutorisation, InitialStates);
  const checkInputsInfo = (event) => {
    const elem = event.target;
    const inputName = elem.name;
    const inputValue = elem.value;

    if (inputName === "email") {
      if (emailValidation(inputValue)) {
        dispathAction(checkEmailValid(true));
        dispathAction(getEmailValue(inputValue));
      } else {
        dispathAction(checkEmailValid(false));
      }
    }
    if (inputName === "username") {
      if (inputValue.length >= 4) {
        dispathAction(checkUserValid(true));
        dispathAction(getUsernameValue(inputValue));
      } else {
        dispathAction(checkUserValid(false));
      }
    }
    if (inputName === "password") {
      if (passwordValidation(inputValue)) {
        console.log("valid");
        console.log(inputValue, "value");
        dispathAction(checkPassValid(true));
        dispathAction(getPassValue(inputValue));
      } else if (!passwordValidation(inputValue)) {
        dispathAction(checkPassValid(false));
      }
      if (testOnLowerCase(inputValue)) {
        console.log("yes");
        dispathAction(checkPasswordOnLowerCase(true));
      } else if (!testOnLowerCase(inputValue)) {
        dispathAction(checkPasswordOnLowerCase(false));
      }
      if (testOnUpperCase(inputValue)) {
        console.log("yes upper");
        dispathAction(checkPasswordOnUpperCase(true));
      } else if (!testOnUpperCase(inputValue)) {
        dispathAction(checkPasswordOnUpperCase(false));
      }
      if (testOnNumber(inputValue)) {
        console.log("yes upper");
        dispathAction(checkPasswordONumber(true));
      } else if (!testOnNumber(inputValue)) {
        dispathAction(checkPasswordONumber(false));
      }
      if (testOnNumber(inputValue)) {
        console.log("yes upper");
        dispathAction(checkPasswordONumber(true));
      } else if (!testOnNumber(inputValue)) {
        dispathAction(checkPasswordONumber(false));
      }
      if (testOnSpecialCharacters(inputValue)) {
        console.log("yes upper");
        dispathAction(checkPasswordOnSpecialSign(true));
      } else if (!testOnSpecialCharacters(inputValue)) {
        dispathAction(checkPasswordOnSpecialSign(false));
      }
      if (inputValue?.length >= 8) {
        console.log("yes upper");
        dispathAction(checkPasswordOnLength(true));
      } else if (inputValue?.length < 8) {
        dispathAction(checkPasswordOnLength(false));
      }
    }
  };
  const submitAutorisation = async (event) => {
    event.preventDefault();
    try {
      const res = signIn
        ? await signInUser({
            username: userNameValue,
            email: emailValue,
            password: passValue,
            role: "user",
          })
        : await logIn({ email: emailValue, password: passValue });
      localStorage.setItem("user_jwt_token", res.jwtToken);
      setUserInfo(res.user);
      setNotificationMessage(
        signIn ? "succesfully registered" : "succesfully loggined"
      );
      closeMenu();
    } catch (error) {
      console.log(error, "error");
      setNotificationMessage(error);
    }
  };
  useEffect(() => {
    const body = document.body;
    if (show) {
      body.classList.add("disable-scroll-page");
      dispathAction(getPassValue(null));
      dispathAction(getEmailValue(null));
      dispathAction(getUsernameValue(null));
      dispathAction(checkPasswordOnLowerCase(false));
      dispathAction(checkPasswordOnUpperCase(false));
      dispathAction(checkPasswordONumber(false));
      dispathAction(checkPasswordOnSpecialSign(false));
      dispathAction(checkPasswordOnLength(false));
    }
    const autoMenu = document
      .getElementById("autorisationMenu")
      ?.getBoundingClientRect();
    if (autoMenu) {
      dispathAction(
        setStyleForBg({
          height: `${autoMenu.height}px`,
          top: `${autoMenu.top}px`,
          maxWidth: `${autoMenu.width}px`,
        })
      );
    }
    return () => {
      body.classList.remove("disable-scroll-page");
      if (window.innerWidth > 1080) {
        body.classList.remove("disable-scroll-page");
      }
    };
  }, [show, signIn]);
  return (
    <>
      {show && !user && (
        <>
          <div onClick={closeMenu} className={a.background} />
          <div style={blurBgStyle} className={a.blurMenuBg} />
          <div id="autorisationMenu" className={a.autorisationMenu}>
            <h1 className={a.title}>{signIn ? "Sign in" : "Log in"}</h1>
            <form className={a.autorisationForm}>
              {signIn && (
                <div className={a.autorisationField}>
                  <input
                    placeholder=" "
                    type="text"
                    id="username"
                    name="username"
                    className={a.autorisationInput}
                    onChange={checkInputsInfo}
                  ></input>
                  <label htmlFor="username" className={a.autorisationLabel}>
                    Username
                  </label>
                  {userValid && userNameValue && (
                    <div className={a.fieldDoneSvg}>
                      <RedDoneIcon />
                    </div>
                  )}
                </div>
              )}
              <div className={a.autorisationField}>
                <input
                  placeholder=" "
                  type="email"
                  id="email"
                  name="email"
                  className={a.autorisationInput}
                  onChange={checkInputsInfo}
                ></input>
                <label htmlFor="email" className={a.autorisationLabel}>
                  Email
                </label>
                {emailValid && emailValue && (
                  <div className={a.fieldDoneSvg}>
                    <RedDoneIcon />
                  </div>
                )}
              </div>
              <div className={a.autorisationField}>
                <input
                  placeholder=""
                  type="password"
                  id="password"
                  name="password"
                  className={a.autorisationInput}
                  onChange={checkInputsInfo}
                ></input>
                <label htmlFor="password" className={a.autorisationLabel}>
                  Chose password
                </label>
                {signIn && (
                  <ul className={a.passwordValid}>
                    <li
                      className={passwordCheck.passlength ? `${a.valid}` : ""}
                      id="chapters_length"
                    >
                      <RedDoneIcon />
                      8-20 chapters
                    </li>
                    <li
                      className={passwordCheck.uppercase ? `${a.valid}` : ""}
                      id="uppercase"
                    >
                      <RedDoneIcon />1 uppercase (A-Z)
                    </li>
                    <li
                      className={passwordCheck.lowercase ? `${a.valid}` : ""}
                      id="lowercase"
                    >
                      <RedDoneIcon />1 lowercase (a-z)
                    </li>
                    <li
                      className={passwordCheck.specialSign ? `${a.valid}` : ""}
                      id="special"
                    >
                      <RedDoneIcon />1 special (!@#$)
                    </li>
                    <li
                      className={passwordCheck.number ? `${a.valid}` : ""}
                      id="number"
                    >
                      <RedDoneIcon />1 number (!@#$)
                    </li>
                  </ul>
                )}
              </div>
              <button
                onClick={submitAutorisation}
                style={
                  signIn
                    ? userNameValue && emailValue && passValue
                      ? { opacity: "1", pointerEvents: "unset" }
                      : { opacity: "0.4", pointerEvents: "none" }
                    : emailValue && passValue
                    ? { opacity: "1", pointerEvents: "unset" }
                    : { opacity: "0.4", pointerEvents: "none" }
                }
                className={a.submitBtn}
              >
                {signIn ? "Sign in" : "Log in"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};
