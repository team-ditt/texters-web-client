import {useCallback, useState} from "react";

export default function useExpandableParagraphRef() {
  const paragraphRef = useCallback((node: HTMLParagraphElement) => {
    if (!node) return;
    const isOverflowed = node.scrollHeight > node.clientHeight;
    setHasEllipsis(isOverflowed);
  }, []);
  const [hasEllipsis, setHasEllipsis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    const toBe = !isExpanded;
    setIsExpanded(toBe);
  };

  return {
    paragraphRef,
    hasEllipsis,
    isExpanded,
    toggleExpand,
  };
}
