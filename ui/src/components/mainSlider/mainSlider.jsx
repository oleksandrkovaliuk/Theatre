import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import m from "./mainSlider.module.scss";
import { maingSliderImgs } from "../../utilitis/mainSliderContent";
import { Swithers } from "../switcher";
export const MainSlider = () => {
  const mainSliderRef = useRef(null);
  const next = () => {
    mainSliderRef.current.slickNext();
  };
  const prev = () => {
    mainSliderRef.current.slickPrev();
  };
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (
    <div className={m.slider_container}>
      <h1 className={m.title}>Kazan Theater of the Young Spectator</h1>
      <div className={m.mainSlider}>
        <Slider ref={mainSliderRef} {...settings}>
          {maingSliderImgs.map((item) => (
            <div key={item.id} className={m.mainSliderImgs}>
              <div
                className={m.bgImage}
                style={{
                  backgroundImage: `url(${item.imgUrl})`,
                }}
              >
                test
              </div>
            </div>
          ))}
        </Slider>
        <div className={m.switcherWrap}>
          <Swithers prev={prev} next={next} />
        </div>
      </div>
    </div>
  );
};
