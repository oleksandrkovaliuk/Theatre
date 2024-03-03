import React, { useContext } from "react";
import f from "./first.module.scss";
import { MainSlider } from "../../../components/mainSlider";
import { EventsContext } from "../../../context/EventsContext";
export const FirstSection = () => {
  const { event } = useContext(EventsContext);
  console.log(event , "eventss")
  return (
    <div className={f.firstSectionContainer}>
      <MainSlider />
      {event?.map((item) => (<div>{item.datetime_column}</div>))}
    </div>
  );
};
