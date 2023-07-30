import {useEffect, useState} from "react";

export default function useKeyboard() {
  const [ctrl, setCtrl] = useState(false);
  const [shift, setShift] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    setShift(event.shiftKey);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    setCtrl(event.ctrlKey);
    setShift(event.shiftKey);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return {
    ctrl,
    shift,
  };
}
