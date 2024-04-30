import React, { useCallback, useContext, useEffect, useState } from "react";
import { USER_ROLE } from "../../../shared/enums";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AutorisationMenu } from "../autorisation";
import { PopUpMenu } from "../../popUpNavMenu";
import { UserIcon } from "../../../icons/userIcon";
import {
  adminDataList,
  userDataList,
} from "../../../utilitis/configForNavMenu";

import l from "./loginSignIn.module.scss";
import { LogOutIcon } from "../../../icons/logOutIcon";
import { SettingsIcon } from "../../../icons/settingsIcon";
import { NotificationContext } from "../../../context/notificationContext";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../../store/reducers/user";

export const LogInSignIn = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => ({
    user: state.user.data,
  }));
  const location = useLocation();

  const { setNotificationMessage } = useContext(NotificationContext);
  const navMenuData =
    user?.role === USER_ROLE.ADMIN ? adminDataList : userDataList;

  const [openSignIn, setOpenSignIn] = useState(false);
  const [autorisationMenu, setAutorisationMenu] = useState(false);
  const [navMenu, setNavMenu] = useState(false);
  const [posForNavMenu, setPosForNavMenu] = useState(null);
  const navigate = useNavigate();

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

  const closeNavMenu = useCallback(() => {
    setNavMenu(false);
    setPosForNavMenu(null);
  }, []);

  const logOutUser = () => {
    dispatch(deleteUser());
    setNotificationMessage("succesfully logout", "success");
    navigate("/");
  };

  useEffect(() => {
    setTimeout(() => {
      if (!user && location.pathname === "/" && window.scrollY === 0) {
        openLogInAutorisationMenu();
        handleOpeningNavMenu();
      }
    }, 500);
  }, [location.pathname, user]);
  return (
    <>
      <AutorisationMenu
        show={autorisationMenu}
        signIn={openSignIn}
        closeMenu={handleClosingMenu}
      />
      <PopUpMenu
        logIn={!!user?.email}
        showMenu={navMenu}
        data={user?.email ? navMenuData : []}
        top={posForNavMenu?.top}
        closeMenu={closeNavMenu}
      >
        {!user?.email ? (
          <div className={l.logInSignInContainer}>
            <button
              style={
                !openSignIn && autorisationMenu
                  ? {
                      backgroundColor: "var(--color-red)",
                      color: "var(--color-white)",
                      scale: "0.98",
                    }
                  : null
              }
              onClick={openLogInAutorisationMenu}
            >
              Login In
            </button>
            <div className={l.signInText}>
              <span>Don't have an account?</span>
              <button onClick={openSignInAutorisationMenu}>Sign In</button>
            </div>
          </div>
        ) : (
          <div className={l.settings_logOut}>
            <NavLink to={"/guid"}>
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
          {user?.img ? (
            <div
              className={l.userAvatar}
              style={{
                backgroundImage: `url(${user?.img})`,
                width: "40px",
                height: "40px",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderRadius: "50%",
                transition: "border 0.3s easy-in-out",
                border: navMenu && "1px solid  var(--color-red",
              }}
            ></div>
          ) : (
            <UserIcon active={navMenu} />
          )}
        </button>
      </div>
    </>
  );
};
