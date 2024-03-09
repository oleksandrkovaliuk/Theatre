import React, { useContext, useEffect, useState } from "react";
import l from "./loginSignIn.module.scss";
import { AutorisationMenu } from "../autorisation";
import { userContext } from "../../../context/userInfoContext";
import { PopUpMenu } from "../../popUpNavMenu";
import { UserIcon } from "../../../icons/userIcon";

export const LogInSignIn = () => {
  const [openSignIn, setToOpenSignIn] = useState(false);
  const [openMenu, showAutorisationMenu] = useState(false);
  const [navMenu, openNavMenu] = useState(false);
  const [navMenuData, setNavMenuData] = useState(null);
  const [posForNavMenu, setPostionForNavMenu] = useState(null);
  const [loginned, setLogin] = useState(false);
  const { user, setUserInfo } = useContext(userContext);
  const openLogInAutorisationMenu = () => {
    showAutorisationMenu(true);
  };
  const openSignInAutorisationMenu = () => {
    showAutorisationMenu(true);
    setToOpenSignIn(true);
  };
  const handleClosingMenu = () => {
    showAutorisationMenu(false);
    setToOpenSignIn(false);
  };
  const logInUser = () => {
    setLogin(true);
  };
  const handleOpeningNavMenu = (event, category) => {
    const position = event.target.getBoundingClientRect();
    if (position) {
      setPostionForNavMenu({
        height: position.height,
        top: position.top,
        width: position.width,
      });
    }
    openNavMenu(true);
  };
  const closeNavMenu = () => {
    openNavMenu(false);
    setPostionForNavMenu(null);
  };
  const logOutUser = () => {
    setUserInfo(null);
    openNavMenu(false);
    setNavMenuData([]);
    setLogin(false);
  };
  useEffect(() => {
    if (user !== null) {
      if (user?.role === "admin") {
        setNavMenuData([
          "Create event",
          "Manage events",
          "Manage news",
          "Settings",
        ]);
      } else {
        setNavMenuData(["Your events", "Settings"]);
      }
      setLogin(true);
    }
    return () => setNavMenuData([]);
  }, [user]);
  return (
    <>
      <AutorisationMenu
        show={openMenu ? true : false}
        signIn={openSignIn ? true : false}
        closeMenu={() => handleClosingMenu()}
        loginUser={() => logInUser()}
      />
      <PopUpMenu
        logIn={loginned ? true : false}
        showMenu={navMenu ? true : false}
        data={navMenuData}
        top={posForNavMenu?.top}
        height={posForNavMenu?.height}
        width={posForNavMenu?.width}
        closeMenu={() => closeNavMenu()}
      >
        {!loginned ? (
          <div className={l.logInSignInContainer}>
            <button onClick={() => openLogInAutorisationMenu()}>
              Login In
            </button>
            <div className={l.signInText}>
              <span>Don't have an account?</span>
              <button onClick={() => openSignInAutorisationMenu()}>
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => logOutUser()} className={l.logOutBtn}>
            Log out
          </button>
        )}
      </PopUpMenu>
      <div className={l.leftNavWrap}>
        <button
          onClick={(event) => handleOpeningNavMenu(event)}
          className={l.accountBtn}
        >
          <UserIcon />
        </button>
      </div>
    </>
  );
};
