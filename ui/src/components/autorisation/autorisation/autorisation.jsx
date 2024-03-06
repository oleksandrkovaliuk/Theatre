import React, { useEffect, useReducer, useState } from "react";
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
} from "./reducer/action";
import { logIn, signInUser } from "../../../services/apiCallConfig";
import { RedDoneIcon } from "../../../icons/redDoneIcon";
export const AutorisationMenu = ({ show, signIn, closeMenu }) => {
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
  const checkUserNameValid = (event) => {
    console.log(event.target.value);
    if (event.target.value.length > 4) {
      dispathAction(checkUserValid(true));
      dispathAction(getUsernameValue(event.target.value));
      console.log(userNameValue, "username");
    } else {
      dispathAction(checkUserValid(false));
    }
  };
  const checkEmailValidation = (event) => {
    if (emailValidation(event.target.value)) {
      dispathAction(checkEmailValid(true));
      dispathAction(getEmailValue(event.target.value));
      console.log(emailValid, "email");
    } else {
      dispathAction(checkEmailValid(false));
    }
  };
  const checkPassValidation = (event) => {
    // password signIn validation
    if (signIn) {
      const lowerCaseLetters = /[a-z]/g;
      const uppercase = /[A-Z]/g;
      const numbers = /[0-9]/g;
      const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      const passLengthValid = document.getElementById("chapters_length");
      const passUpperCaseValid = document.getElementById("uppercase");
      const passLowerCaseValid = document.getElementById("lowercase");
      const passSpecialValid = document.getElementById("special");
      const passNumberValid = document.getElementById("number");
      if (lowerCaseLetters.test(event.target.value)) {
        passLowerCaseValid.classList.add(`${a.valid}`);
      } else {
        passLowerCaseValid.classList.remove(`${a.valid}`);
      }
      if (uppercase.test(event.target.value)) {
        passUpperCaseValid.classList.add(`${a.valid}`);
      } else {
        passUpperCaseValid.classList.remove(`${a.valid}`);
      }
      if (numbers.test(event.target.value)) {
        passNumberValid.classList.add(`${a.valid}`);
      } else {
        passNumberValid.classList.remove(`${a.valid}`);
      }
      if (event.target.value.length >= 8) {
        passLengthValid.classList.add(`${a.valid}`);
      } else {
        passLengthValid.classList.remove(`${a.valid}`);
      }
      if (specialCharacters.test(event.target.value)) {
        passSpecialValid.classList.add(`${a.valid}`);
      } else {
        passSpecialValid.classList.remove(`${a.valid}`);
      }
    }

    if (event.target.value)
      if (passwordValidation(event.target.value)) {
        dispathAction(checkPassValid(true));
        dispathAction(getPassValue(event.target.value));
      } else {
        dispathAction(checkPassValid(false));
      }
  };
  const submitAutorisation = async (event) => {
    event.preventDefault();
    try {
      if (signIn) {
        await signInUser({
          username: userNameValue,
          email: emailValue,
          password: passValue,
          role: "user",
        });
      } else {
        const res = await logIn({ email: emailValue, password: passValue });
        localStorage.setItem("user_jwt_token", JSON.stringify(res.jwtToken));
        console.log(res.user.username, "name");
      }
      closeMenu();
    } catch (error) {
      dispathAction(setError(error.toString().split(":").pop()));
    }
  };
  useEffect(() => {
    const body = document.body;
    if (show) {
      body.classList.add("disable-scroll-page");
      console.log(emailValue , "value")
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
  }, [show]);
  return (
    <>
      {show && (
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
                    onChange={(event) => checkUserNameValid(event)}
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
                  onChange={(event) => checkEmailValidation(event)}
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
                  onChange={(event) => checkPassValidation(event)}
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
                onClick={(event) => submitAutorisation(event)}
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
