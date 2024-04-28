import React, { useCallback, useContext, useEffect, useReducer } from "react";
import a from "./autorisation.module.scss";
import { emailValidation } from "../../../services/emailValidation";
import { passwordValidation } from "../../../services/passwordValidation";
import { InitialStates, reducerForAutorisation } from "./reducer/reducer";
import { GoogleLogin } from "@react-oauth/google";
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
import { RedDoneIcon } from "../../../icons/redDoneIcon";
import {
  testOnLowerCase,
  testOnNumber,
  testOnSpecialCharacters,
  testOnUpperCase,
} from "../../../utilitis/patterForCheckPass";
import { NotificationContext } from "../../../context/notificationContext";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/thunks/user/loginUser";
import { registerUser } from "../../../store/thunks/user/registerUser";
import { GitHub } from "../../../icons/gitHub";
import { getCookie } from "../../../services/apiCallConfig";

export const AutorisationMenu = ({ show, signIn, closeMenu }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({
    user: state.user.data,
  }));

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
        dispathAction(checkPassValid(true));
        dispathAction(getPassValue(inputValue));
      } else if (!passwordValidation(inputValue)) {
        dispathAction(checkPassValid(false));
      }
      if (testOnLowerCase(inputValue)) {
        dispathAction(checkPasswordOnLowerCase(true));
      } else if (!testOnLowerCase(inputValue)) {
        dispathAction(checkPasswordOnLowerCase(false));
      }
      if (testOnUpperCase(inputValue)) {
        dispathAction(checkPasswordOnUpperCase(true));
      } else if (!testOnUpperCase(inputValue)) {
        dispathAction(checkPasswordOnUpperCase(false));
      }
      if (testOnNumber(inputValue)) {
        dispathAction(checkPasswordONumber(true));
      } else if (!testOnNumber(inputValue)) {
        dispathAction(checkPasswordONumber(false));
      }
      if (testOnSpecialCharacters(inputValue)) {
        dispathAction(checkPasswordOnSpecialSign(true));
      } else if (!testOnSpecialCharacters(inputValue)) {
        dispathAction(checkPasswordOnSpecialSign(false));
      }
      if (inputValue?.length >= 8) {
        dispathAction(checkPasswordOnLength(true));
      } else if (inputValue?.length < 8) {
        dispathAction(checkPasswordOnLength(false));
      }
    }
  };
  const submitAutorisation = async (event, oAuthCredential) => {
    if (event) {
      event.preventDefault();
    }
    try {
      signIn
        ? await dispatch(
            registerUser({
              username: userNameValue,
              email: emailValue,
              password: passValue,
              role: "user",
              jwt_user: oAuthCredential,
            })
          ).unwrap()
        : await dispatch(
            loginUser({
              email: emailValue,
              password: passValue,
              jwt_user: oAuthCredential,
            })
          ).unwrap();

      const notification = signIn
        ? "succesfully registered"
        : "succesfully loggined";

      setNotificationMessage(notification, "success");
      closeMenu();
    } catch (error) {
      setNotificationMessage(error, "danger");
    }
  };
  const gitHubRedirect = async (e) => {
    e.preventDefault();

    try {
      window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GITHUB_REDIRECT_URL}?path=/&scope=user:email`
      );
    } catch (error) {
      setNotificationMessage(error, "danger");
    }
  };
  const gettingCookies = useCallback(async () => {
    if (!user) {
      try {
        await getCookie();
      } catch (error) {
        setNotificationMessage(error, "danger");
      }
    }
  }, [setNotificationMessage, user]);
  useEffect(() => {
    gettingCookies();
  }, [gettingCookies]);
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
      {show && !user?.email && (
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
                  autoComplete="current-password"
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
              <div className={a.differentTypeAutorisate}>
                <div className={a.or}>
                  <span>Or</span>
                </div>
                <div className={a.wayHowToAutorisate}>
                  <button onClick={gitHubRedirect}>
                    <GitHub />
                  </button>
                  <button>
                    <GoogleLogin
                      onSuccess={(credentialResponse) =>
                        submitAutorisation(null, credentialResponse.credential)
                      }
                      onError={() => {
                        setNotificationMessage(
                          signIn ? "failed with sign in" : "failed with login",
                          "danger"
                        );
                      }}
                    />
                  </button>
                </div>
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
