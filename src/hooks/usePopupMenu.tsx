import {CSSProperties, MouseEvent, ReactNode, useRef, useState} from "react";
import {createPortal} from "react-dom";

type VerticalAlignment = "top-bottom" | "bottom-top" | "top-top" | "bottom-bottom";
type HorizontalAlignment = "left-right" | "right-left" | "left-left" | "right-right";
type PopupMenuProps = {
  vAlign: VerticalAlignment;
  hAlign: HorizontalAlignment;
  children?: ReactNode;
};
export default function usePopupMenu<T extends HTMLElement = HTMLButtonElement>(
  root?: HTMLElement,
) {
  const anchorRef = useRef<T>(null);
  const [isPopupMenuOpen, setIsMenuOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect>();

  const openPopupMenu = () => {
    if (!anchorRef.current) return;
    setIsMenuOpen(true);
    setRect(anchorRef.current.getBoundingClientRect());
  };
  const closePopupMenu = () => {
    setIsMenuOpen(false);
  };

  const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    closePopupMenu();
  };

  const PopupMenu = ({children, vAlign, hAlign}: PopupMenuProps) => {
    if (!rect || !isPopupMenuOpen) return;
    const style: CSSProperties = {};
    if (vAlign.startsWith("top"))
      style.top = `${vAlign.endsWith("top") ? rect.top : rect.bottom}px`;
    if (vAlign.startsWith("bottom"))
      style.bottom = `${vAlign.endsWith("top") ? rect.top : rect.bottom}px`;
    if (hAlign.startsWith("left"))
      style.left = `${hAlign.endsWith("left") ? rect.left : rect.right}px`;
    if (hAlign.startsWith("right"))
      style.right = `calc(100% - ${hAlign.endsWith("left") ? rect.x : rect.x + rect.width}px)`;

    return createPortal(
      <>
        <div
          className="fixed inset-0 w-full h-full bg-transparent z-[12000]"
          onClick={onOverlayClick}
        />
        <div className="absolute z-[12000]" style={style}>
          {children}
        </div>
      </>,
      root ?? document.body,
    );
  };

  return {
    anchorRef,
    isPopupMenuOpen,
    openPopupMenu,
    closePopupMenu,
    PopupMenu,
  };
}
