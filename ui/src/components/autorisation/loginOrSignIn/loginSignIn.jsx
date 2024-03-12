import React, { useContext, useState } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { AutorisationMenu } from "../autorisation";
import { userContext } from "../../../context/userInfoContext";
import { PopUpMenu } from "../../popUpNavMenu";
import { UserIcon } from "../../../icons/userIcon";
import {
  adminDataList,
  userDataList,
} from "../../../utilitis/configForNavMenu";

import l from "./loginSignIn.module.scss";
import { LogOutIcon } from "../../../icons/logOutIcon";
import { SettingsIcon } from "../../../icons/settingsIcon";

export const LogInSignIn = () => {
  const { user, setUserInfo } = useContext(userContext);
  const navMenuData =
    user?.role === process.env.REACT_APP_ADMIN ? adminDataList : userDataList;

  const [openSignIn, setOpenSignIn] = useState(false);
  const [autorisationMenu, setAutorisationMenu] = useState(false);
  const [navMenu, setNavMenu] = useState(false);
  const [posForNavMenu, setPosForNavMenu] = useState(null);

  const openLogInAutorisationMenu = () => {
    setAutorisationMenu(true);
    setOpenSignIn(false);
  };
  const openSignInAutorisationMenu = () => {
    setAutorisationMenu(true);
    setOpenSignIn(true);
  };

  const handleClosingMenu = () => {
    setAutorisationMenu(false);
    setOpenSignIn(false);
  };
  const handleOpeningNavMenu = () => {
    const header = document.getElementById("header").getBoundingClientRect();
    if (header) {
      setPosForNavMenu({
        top: header.height,
      });
    }
    setNavMenu(true);
  };

  const closeNavMenu = () => {
    setNavMenu(false);
    setPosForNavMenu(null);
  };
  const logOutUser = () => {
    setUserInfo(null);
    localStorage.removeItem("user_jwt_token");
  };
  return (
    <>
      <AutorisationMenu
        show={autorisationMenu}
        signIn={openSignIn}
        closeMenu={handleClosingMenu}
      />
      <PopUpMenu
        logIn={!!user}
        showMenu={navMenu}
        data={user ? navMenuData : []}
        top={posForNavMenu?.top}
        closeMenu={closeNavMenu}
      >
        {!user ? (
          <div className={l.logInSignInContainer}>
            <button onClick={openLogInAutorisationMenu}>Login In</button>
            <div className={l.signInText}>
              <span>Don't have an account?</span>
              <button onClick={openSignInAutorisationMenu}>Sign In</button>
            </div>
          </div>
        ) : (
          <div className={l.settings_logOut}>
            <NavLink to={"/settings"}>
              <SettingsIcon />
            </NavLink>
            <button onClick={logOutUser}>
              <LogOutIcon />
            </button>
          </div>
        )}
      </PopUpMenu>
      <div className={l.leftNavWrap}>
        <button
          onClick={handleOpeningNavMenu}
          onMouseOver={!navMenu ? handleOpeningNavMenu : null}
          className={l.accountBtn}
        >
          <UserIcon active={navMenu} />
        </button>
      </div>
    </>
  );
};
