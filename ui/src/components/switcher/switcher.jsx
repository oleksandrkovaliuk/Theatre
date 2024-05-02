import React from "react";
import s from "./switcher.module.scss";
import { LeftArrow } from "../../icons/leftArrow";
import { RightArrow } from "../../icons/rightArrow";
import { Button } from "@nextui-org/react";
export const Swithers = ({ prev, next }) => {
  return (
    <div className={s.switcherContainer}>
      <Button
        isIconOnly
        size={window.innerWidth > 768 ? "lg" : "md"}
        style={{ borderRadius: "30px" }}
        onClick={prev}
        color="default"
        variant="flat"
      >
        <LeftArrow />
      </Button>
      <Button
        isIconOnly
        size={window.innerWidth > 768 ? "lg" : "md"}
        style={{ borderRadius: "30px" }}
        onClick={next}
        color="default"
        variant="flat"
      >
        <RightArrow />
      </Button>
    </div>
  );
};
