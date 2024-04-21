import React, { useEffect, useContext, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import classNames from "classnames";
import m from "./popUpNavMenu.module.scss";
import { USER_ROLE } from "../../shared/enums";
import { useSelector } from "react-redux";
export const PopUpMenu = ({
  data,
  top,
  children,
  logIn,
  showMenu,
  closeMenu,
}) => {
  const { user } = useSelector((state) => ({
    user: state.user,
  }));
  const ref = useRef(null);
  const location = useLocation();
  const [styleForMenuBg, setStyleForMenuBg] = useState(null);
  const classes = classNames(m.menu_container, {
    [m.show]: showMenu,
  });
  useEffect(() => {
    closeMenu();
  }, [closeMenu, location.pathname]);

  useEffect(() => {
    const body = document.body;
    if (showMenu) {
      const getMenuRect = ref.current
        ? ref.current.getBoundingClientRect()
        : null;
      setStyleForMenuBg({
        top: getMenuRect ? `calc(${top}px + ${getMenuRect.height}px)` : "0px",
      });
      body.classList.add("disable-scroll-page");
    }
    return () => {
      body.classList.remove("disable-scroll-page");
      if (window.innerWidth > 1080) {
        body.classList.remove("disable-scroll-page");
      }
    };
  }, [showMenu, top, children]);

  return (
    <>
      {showMenu && (
        <div onClick={closeMenu} style={styleForMenuBg} className={m.bg} />
      )}
      <div
        ref={ref}
        style={{
          top: `${top}px`,
          paddingBlock: showMenu ? "8px 20px" : "0px",
        }}
        className={classes}
      >
        <div className={m.menu_wrap}>
          {logIn && (
            <div className={m.userInfo}>
              <span>Account Info</span>
              <p>
                {user.loginned.role === USER_ROLE.ADMIN && "admin"}
                <span>/</span>
                {user.loginned.username}
              </p>
              <p>{user.loginned.email}</p>
            </div>
          )}
          <ul className={m.navigation_wrap}>
            {logIn && (
              <>
                <span>Navigation</span>
                {data?.map(({ link, name }) => {
                  return (
                    <li key={link} className={m.navigation_nav_list}>
                      <NavLink to={link}>{name}</NavLink>
                    </li>
                  );
                })}
              </>
            )}
            {children}
          </ul>
        </div>
      </div>
    </>
  );
};
