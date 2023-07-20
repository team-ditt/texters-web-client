import {useEffect, useRef, useState} from "react";

export default function useBookDescriptionRef(maxLines: number) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [hasEllipsis, setHasEllipsis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    const toBe = !isExpanded;
    setIsExpanded(toBe);
  };

  useEffect(() => {
    if (!descriptionRef.current) return;

    const isOverflowed = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
    setHasEllipsis(isOverflowed);
  }, [descriptionRef.current]);

  return {
    descriptionRef,
    hasEllipsis,
    isExpanded,
    toggleExpand,
  };
}
