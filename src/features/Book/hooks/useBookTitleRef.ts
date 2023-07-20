import {toBalancedTwoLines} from "@/utils/formatter";
import {useCallback} from "react";

const DEFAULT_LINE_HEIGHT = 30;
export default function useBookTitleRef(title?: string, lineHeight: number = DEFAULT_LINE_HEIGHT) {
  const titleRef = useCallback(
    (node: HTMLSpanElement) => {
      if (!node || !title) return;

      const isOverflowed = node.clientHeight > lineHeight;
      node.innerText = isOverflowed ? toBalancedTwoLines(title) : title;
    },
    [title],
  );

  return {titleRef};
}
