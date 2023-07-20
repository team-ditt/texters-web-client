import {toBalancedTwoLines} from "@/utils/formatter";
import {useEffect, useRef} from "react";

const DEFAULT_LINE_HEIGHT = 30;
export default function useBookTitleRef(title?: string, lineHeight: number = DEFAULT_LINE_HEIGHT) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!titleRef.current || !title) return;

    const isOverflowed = titleRef.current.clientHeight > lineHeight;
    titleRef.current.innerText = isOverflowed ? toBalancedTwoLines(title) : title;
  }, [titleRef.current, title]);

  return {titleRef};
}
