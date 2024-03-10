import React, { useContext, useState } from "react";
import l from "./loginSignIn.module.scss";
import { AutorisationMenu } from "../autorisation";
import { userContext } from "../../../context/userInfoContext";
import { PopUpMenu } from "../../popUpNavMenu";
import { UserIcon } from "../../../icons/userIcon";
import {
  adminDataList,
  userDataList,
} from "../../../utilitis/configForNavMenu";

export const LogInSignIn = () => {
  const { user, setUserInfo } = useContext(userContext);
  const navMenuData = user?.role === "admin" ? adminDataList : userDataList;
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
  const handleOpeningNavMenu = (event, category) => {
    const position = event.target.getBoundingClientRect();
    if (position) {
      setPosForNavMenu({
        height: position.height,
        top: position.top,
        width: position.width,
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
    setNavMenu(false);
    localStorage.removeItem("user_jwt_token");
  };
  return (
    <>
      <AutorisationMenu
        show={autorisationMenu}
        signIn={openSignIn}
        closeMenu={() => handleClosingMenu()}
      />
      <PopUpMenu
        logIn={!!user}
        showMenu={navMenu}
        data={user ? navMenuData : []}
        top={posForNavMenu?.top}
        height={posForNavMenu?.height}
        width={posForNavMenu?.width}
        closeMenu={() => closeNavMenu()}
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
