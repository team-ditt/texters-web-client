import {useEffect, useRef} from "react";

export default function useRequestAnimationFrame(callback: (time: number) => void) {
  const stop = useRef(false);

  const internalCallback = (time: number) => {
    callback(time);
    if (!stop.current) requestAnimationFrame(internalCallback);
  };

  useEffect(() => {
    stop.current = false;
    requestAnimationFrame(internalCallback);
    return () => {
      stop.current = true;
    };
  }, []);
}
