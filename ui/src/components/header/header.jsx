import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import h from "./header.module.scss";
import { LogInSignIn } from "../autorisation/loginOrSignIn";

export const Header = () => {
  const [appearHeader, setAppearHeader] = useState(false);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const appearHeaderIfScrollBottom = () => {
      const currScrollPos = window.scrollY;
      if (prevScrollPos < currScrollPos) {
        setAppearHeader(false);
      }
      if (prevScrollPos > currScrollPos) {
        setAppearHeader(true);
      }
      prevScrollPos = currScrollPos;
    };
    window.addEventListener("scroll", appearHeaderIfScrollBottom);
    return () => {
      window.removeEventListener("scroll", appearHeaderIfScrollBottom);
    };
  }, []);
  return (
    <div
      id="header"
      style={appearHeader ? { top: "0px" } : { top: "-100px" }}
      className={h.header_container}
    >
      <ul className={h.leftNavBar}>
        <li className={h.header_nav}>
          <NavLink to={"/"}>
            <img
              src="./images/logo.png"
              style={{ flexShrink: "0 ", borderRadius: "4px" }}
              alt="logo"
            />
          </NavLink>
        </li>
        <li className={h.header_nav}>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li className={h.header_nav}>
          <NavLink to={"/historyOfBookedEvents"}>History</NavLink>
        </li>
        <li className={h.header_nav}>
          <NavLink to={"/guide"}>Guide</NavLink>
        </li>
      </ul>
      <LogInSignIn />
    </div>
  );
};
