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
  setError,
  setAppercaseValid,
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
export const AutorisationMenu = ({ show, signIn, closeMenu }) => {
  const { user, setUserInfo } = useContext(userContext);
  const [
    {
      blurBgStyle,
      userValid,
      emailValid,
      passValid,
      userNameValue,
      emailValue,
      passValue,
      error,
    },
    dispathAction,
  ] = useReducer(reducerForAutorisation, InitialStates);
  // const checkUserNameValid = (event) => {
  //   console.log(event.target.value);
  //   if (event.target.value.length > 4) {
  //     dispathAction(checkUserValid(true));
  //     dispathAction(getUsernameValue(event.target.value));
  //     console.log(userNameValue, "username");
  //   } else {
  //     dispathAction(checkUserValid(false));
  //   }
  // };
  // const checkEmailValidation = (event) => {
  //   if (emailValidation(event.target.value)) {
  //     dispathAction(checkEmailValid(true));
  //     dispathAction(getEmailValue(event.target.value));
  //     console.log(emailValid, "email");
  //   } else {
  //     dispathAction(checkEmailValid(false));
  //   }
  // };
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
      if (inputValue) {
        if (passwordValidation(inputValue)) {
          dispathAction(checkPassValid(true));
          dispathAction(getPassValue(inputValue));
        }
      } else {
        dispathAction(checkPassValid(false));
      }

      // if (testOnUpperCase(inputValue)) {
      //   dispathAction(setAppercaseValid(true));
      // } else {
      //   dispathAction(setAppercaseValid(false));
      // }
    }
  };
  // const checkPassValidation = (event) => {
  //   // password signIn validation
  //   if (signIn) {
  //     // if (testOnSpecialCharacters(event.target.value)) {
  //     //   console.log(passValidation);
  //     //   setPassValidation({ ...passValidation, special: true });
  //     // } else {
  //     //   setPassValidation({ special: false });
  //     // }
  //     // if (event.target.value >= 8) {
  //     //   console.log(passValidation);
  //     //   setPassValidation({ ...passValidation, length: true });
  //     // } else {
  //     //   setPassValidation({ length: false });
  //     // }
  //   }

  //   if (event.target.value) {
  //     if (passwordValidation(event.target.value)) {
  //       dispathAction(checkPassValid(true));
  //       dispathAction(getPassValue(event.target.value));
  //     }
  //   } else {
  //     dispathAction(checkPassValid(false));
  //   }
  // };
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
      closeMenu();
    } catch (error) {
      dispathAction(setError(error.toString().split(":").pop()));
    }
  };
  useEffect(() => {
    const body = document.body;
    if (show) {
      body.classList.add("disable-scroll-page");
      dispathAction(setError(null));
      dispathAction(getPassValue(null));
      dispathAction(getEmailValue(null));
      dispathAction(getUsernameValue(null));
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
                    type="username"
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
                  placeholder=" "
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
                    <li id="chapters_length">
                      <RedDoneIcon />
                      8-20 chapters
                    </li>
                    <li id="uppercase">
                      <RedDoneIcon />1 uppercase (A-Z)
                    </li>
                    <li id="lowercase">
                      <RedDoneIcon />1 lowercase (a-z)
                    </li>
                    <li id="special">
                      <RedDoneIcon />1 special (!@#$)
                    </li>
                    <li id="number">
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
