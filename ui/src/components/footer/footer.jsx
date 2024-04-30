import React from "react";
import o from "./footer.module.scss";
import { NavLink } from "react-router-dom";
export const Footer = () => {
  return (
    <div className={o.policyContainer}>
      <div className={o.topBlock}>
        <span>create by </span>
        <NavLink to="https://www.linkedin.com/in/oleksandrkovaliuk/">
          @Oleksandr Kovaliuk
        </NavLink>
      </div>
      <ul className={o.bottom_block}>
        <li>
          <NavLink to="https://www.linkedin.com/in/oleksandrkovaliuk/">
            in
          </NavLink>
        </li>
        <li>
          <NavLink to="https://github.com/oleksandrkovaliuk">github</NavLink>
        </li>
        <li>
          <NavLink to="https://docs.google.com/document/d/1jYX6t-OCSrujM1KI8qJ3E45EeOL-6wG5/edit">
            resume
          </NavLink>
        </li>
        <li>
          <NavLink to="https://divesea.onrender.com/">dive sea</NavLink>
        </li>
      </ul>
    </div>
  );
};
