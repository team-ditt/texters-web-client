import {useEffect, useRef} from "react";

export default function useDebounce<T>(
  callback: (current: T) => void,
  delay: number,
  dependency: T,
  callbackImmediate?: (current: T) => void,
  disabled?: boolean,
  fireOnInitial?: boolean,
) {
  const value = useRef(dependency);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isInitial = useRef(true);

  useEffect(() => {
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
        callback(value.current);
      }
    };
  }, []);

  useEffect(() => {
    function wrapper() {
      callback(value.current);
    }

    if (disabled) return;
    value.current = dependency;

    if (isInitial.current && !fireOnInitial) {
      isInitial.current = false;
      return;
    }

    if (callbackImmediate) callbackImmediate(value.current);

    const _timeout = setTimeout(wrapper, delay);
    timeout.current = _timeout;
    return () => {
      clearTimeout(_timeout);
      timeout.current = null;
    };
  }, [dependency]);
}
