import { React, useEffect, useRef } from "react";

export const ObservationHandler = ({ onObserv, delay = 200 }) => {
  const observRef = useRef(null);
  useEffect(() => {
    const observ = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("entered to elem");
          onObserv();
        }
      },
      { delay }
    );
    observ.observe(observRef.current);

    return () => {
      if (observRef.current) {
        console.log("unobser");
        observ.unobserve(observRef.current);
      }
    };
  }, [onObserv, delay]);
  return <div ref={observRef} />;
};
