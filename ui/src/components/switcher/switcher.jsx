import React from "react";
import s from "./switcher.module.scss";
import { LeftArrow } from "../../icons/leftArrow";
import { RightArrow } from "../../icons/rightArrow";
export const Swithers = ({ prev, next }) => {
  return (
    <div className={s.switcherContainer}>
      <button onClick={prev}>
        <LeftArrow />
      </button>
      <button onClick={next}>
        <RightArrow />
      </button>
    </div>
  );
};
