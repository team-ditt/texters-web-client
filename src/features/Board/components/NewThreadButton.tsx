import {ReactComponent as PlusIcon} from "assets/icons/plus.svg";
import {useRef, useState} from "react";
import {useNavigate} from "react-router";

type Props = {
  boardId: string;
};

export default function NewThreadButton({boardId}: Props) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isCollapsedTouch, setIsCollapsedTouch] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const expand = () => {
    setExpanded(true);
  };
  const collapse = () => {
    setExpanded(false);
    timeout.current = null;
  };

  const delayedCollapse = (delay: number) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(collapse, delay);
  };
  const onTouchMove = () => {
    delayedCollapse(5000);
  };
  const onTouchEnd = () => {
    setIsCollapsedTouch(!expanded);
    expand();
    delayedCollapse(5000);
  };
  const onMouseOver = () => {
    expand();
  };
  const onMouseLeave = () => {
    delayedCollapse(500);
  };
  const onClick = () => {
    if (isCollapsedTouch) return;
    navigate(`/boards/${boardId}/threads/new`);
  };

  return (
    <div
      className={`absolute bottom-6 right-6 min-w-[48px] h-[48px] bg-[#333] rounded-full flex flex-row justify-center items-center transition-all duration-500 cursor-pointer ${
        expanded ? "px-5 gap-2" : "px-2 gap-0"
      }`}
      style={{
        boxShadow:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.15), 0px 3px 3px 0px rgba(0, 0, 0, 0.13), 0px 7px 4px 0px rgba(0, 0, 0, 0.08), 0px 13px 5px 0px rgba(0, 0, 0, 0.02), 0px 21px 6px 0px rgba(0, 0, 0, 0.00)",
      }}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}>
      <span
        className={`text-white overflow-hidden transition-all duration-500 whitespace-nowrap text-[16px] font-bold ${
          expanded ? "max-w-[150px]" : "max-w-0"
        }`}>
        아이디어 추가하기
      </span>
      <PlusIcon fill="white" width={28} height={28} />
    </div>
  );
}
