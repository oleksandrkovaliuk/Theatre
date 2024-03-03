import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import h from "./header.module.scss";
import { LogInSignIn } from "../autorisation/loginOrSignIn";
import { getEvents } from "../../services/apiCallConfig";

export const Header = () => {
  const navigation = useNavigate();
  const navigateTo = (link) => navigation(link);
  return (
    <div className={h.header_container}>
      <ul className={h.leftNavBar}>
        <li onClick={() => navigateTo("/")} className={h.header_nav}>
          <img src="./images/logo.png" alt="logo" />
        </li>
        <li className={h.header_nav}>Home</li>
        <li className={h.header_nav}>Tickets</li>
        <li className={h.header_nav}>News</li>
        <li className={h.header_nav}>About Theater</li>
      </ul>
      <LogInSignIn />
    </div>
  );
};
