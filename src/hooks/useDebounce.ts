import {useEffect, useRef} from "react";

export default function useDebounce<T>(
  callback: (current: T) => void,
  delay: number,
  dependency: T,
  disabled?: boolean,
  fireImmediately?: boolean,
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

    if (isInitial.current && !fireImmediately) {
      isInitial.current = false;
      return;
    }

    const _timeout = setTimeout(wrapper, delay);
    timeout.current = _timeout;
    return () => {
      clearTimeout(_timeout);
      timeout.current = null;
    };
  }, [dependency]);
}
