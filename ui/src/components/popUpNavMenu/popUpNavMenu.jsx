import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import m from "./popUpNavMenu.module.scss";
import { userContext } from "../../context/userInfoContext";
import { CrownIcon } from "../../icons/crownIcon";
import { LeftArrow } from "../../icons/leftArrow";
export const PopUpMenu = ({
  data,
  top,
  height,
  children,
  width,
  logIn,
  showMenu,
  closeMenu,
}) => {
  const { user } = useContext(userContext);
  let style = {
    right: `${width}px`,
    top: `calc(${top}px + ${height}px)`,
  };
  useEffect(() => {
    const body = document.body;
    if (showMenu) {
      body.classList.add("disable-scroll-page");
    }
    return () => {
      body.classList.remove("disable-scroll-page");
      if (window.innerWidth > 1080) {
        body.classList.remove("disable-scroll-page");
      }
    };
  }, [showMenu]);
  return (
    <>
      {showMenu && (
        <>
          <div onClick={closeMenu} className={m.bg} />
          <div id="menuContainer" style={style} className={m.menu_container}>
            <ul className={m.menu_wrap}>
              {logIn && (
                <div className={m.userInfo}>
                  <h1 className={m.title}>Account info</h1>
                  <div className={m.userName}>
                    {user?.role === "admin" && <CrownIcon />}
                    <p>{user?.username}</p>
                  </div>
                  <p>{user?.email}</p>
                </div>
              )}
              {data?.map(({ item }) => {
                return (
                  <li key={item} className={m.menu_nav_list}>
                    <NavLink to={item?.link}>{item?.name}</NavLink>
                  </li>
                );
              })}
              {children}
            </ul>
          </div>
        </>
      )}
    </>
  );
};
