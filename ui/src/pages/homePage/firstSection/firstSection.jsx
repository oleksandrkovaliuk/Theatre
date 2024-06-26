import React from "react";
import f from "./first.module.scss";
import { MainSlider } from "../../../components/mainSlider";
import { Link } from "react-router-dom";
export const FirstSection = () => {
  return (
    <div className={f.firstSectionContainer}>
      <MainSlider />
      <div className={f.bottomInfo}>
        <div className={f.leftBlock}>
          <div className={f.leftSubBlock}>
            <span>date of creation</span>
            <p>1932</p>
          </div>
          <div className={f.leftSubBlock}>
            <span>2020-2021</span>
            <p>34 shows</p>
          </div>
          <div className={f.leftSubBlock}>
            <span>Absolutely for everyone</span>
            <p>0+</p>
          </div>
        </div>
        <Link className={f.learnMore} to={"/guide"}>
          Learn More about Theater
        </Link>
      </div>
    </div>
  );
};
