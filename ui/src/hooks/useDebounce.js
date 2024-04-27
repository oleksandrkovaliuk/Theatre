import { useEffect, useMemo, useRef } from "react";

function debounc(func, time = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, [time]);
  };
}

export const useDebounce = (callBack, time) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = callBack;
  }, [callBack]);

  const debounceCallBack = useMemo(() => {
    const func = (event) => {
      ref.current?.(event);
    };
    return debounc(func, time);
  }, [time]);
  return debounceCallBack;
};
