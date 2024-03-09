import React, { useContext, useState } from "react";
import l from "./loginSignIn.module.scss";
import { AutorisationMenu } from "../autorisation";
import { userContext } from "../../../context/userInfoContext";
import { PopUpMenu } from "../../popUpNavMenu";
import { UserIcon } from "../../../icons/userIcon";

const userMenuLinks = [
  {
    link: "/yourEvents",
    name: "Your events",
  },
  {
    link: "/settings",
    name: "Settings",
  },
];

const adminMenuLinks = [
  {
    link: "/yourEvents",
    name: "Your events",
  },
  {
    link: "/createEvent",
    name: "Create Event",
  },
  {
    link: "/manageEvents",
    name: "Manage Events",
  },
  {
    link: "/manageNews",
    name: "Manage News",
  },
  {
    link: "/settings",
    name: "Settings",
  },
];

export const LogInSignIn = () => {
  const { user, setUserInfo } = useContext(userContext);

  const [navMenu, setNavMenu] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openMenu, showAutorisationMenu] = useState(false);
  const [posForNavMenu, setPostionForNavMenu] = useState(null);

  const openSignInAutorisationMenu = () => {
    showAutorisationMenu(true);
    setOpenSignIn(true);
  };

  const handleClosingMenu = () => {
    showAutorisationMenu(false);
    setOpenSignIn(false);
  };

  const handleOpeningNavMenu = (event) => {
    const position = event.target.getBoundingClientRect();
    if (position) {
      setPostionForNavMenu({
        height: position.height,
        top: position.top,
        width: position.width,
      });
    }
    setNavMenu(true);
  };

  const closeNavMenu = () => {
    setNavMenu(false);
    setPostionForNavMenu(null);
  };

  const logOutUser = () => {
    setUserInfo(null);
    setNavMenu(false);
    localStorage.removeItem("user_jwt_token");
  };

  const navMenuData = user?.role === "admin" ? adminMenuLinks : userMenuLinks;
  return (
    <>
      <AutorisationMenu
        show={!!openMenu}
        signIn={!!openSignIn}
        closeMenu={() => handleClosingMenu()}
      />
      <PopUpMenu
        logIn={!!user}
        showMenu={!!navMenu}
        data={navMenuData}
        top={posForNavMenu?.top}
        height={posForNavMenu?.height}
        width={posForNavMenu?.width}
        closeMenu={() => closeNavMenu()}
      >
        {!user ? (
          <div className={l.logInSignInContainer}>
            <button onClick={() => showAutorisationMenu(true)}>Login In</button>
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
