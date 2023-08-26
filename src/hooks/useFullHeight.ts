import {useEffect, useRef} from "react";

export default function useFullHeight() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = containerRef.current;
    for (
      let element: HTMLElement | null = currentElement;
      element;
      element = element.parentElement
    ) {
      element.style.height = "100%";
    }
    return () => {
      for (
        let element: HTMLElement | null = currentElement;
        element;
        element = element.parentElement
      ) {
        element.style.height = "";
      }
    };
  }, []);

  return {containerRef};
}
