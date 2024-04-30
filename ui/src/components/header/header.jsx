import React from "react";
import { NavLink } from "react-router-dom";
import h from "./header.module.scss";
import { LogInSignIn } from "../autorisation/loginOrSignIn";
export const Header = () => {
  return (
    <div id="header" className={h.header_container}>
      <ul className={h.leftNavBar}>
        <li className={h.header_nav}>
          <NavLink to={"/"}>
            <img src="./images/logo.png" alt="logo" />
          </NavLink>
        </li>
        <li className={h.header_nav}>
          <NavLink to={"/"}>Home</NavLink>
        </li>
        <li className={h.header_nav}>
          <NavLink to={"/historyOfBookedEvents"}>History</NavLink>
        </li>
      </ul>
      <LogInSignIn />
    </div>
  );
};
