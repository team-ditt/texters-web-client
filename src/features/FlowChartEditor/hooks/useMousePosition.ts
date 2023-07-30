import {useEffect, useState} from "react";

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      setMousePosition({x: event.clientX, y: event.clientY});
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return mousePosition;
}
