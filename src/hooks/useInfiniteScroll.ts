import {useEffect, useRef} from "react";

export default function useInfiniteScroll(fetcher: () => void) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) fetcher();
    },
    {threshold: 1},
  );

  useEffect(() => {
    if (triggerRef.current) observer.observe(triggerRef.current);

    return () => {
      if (triggerRef.current) observer.unobserve(triggerRef.current);
    };
  }, [observer]);

  return {triggerRef};
}
