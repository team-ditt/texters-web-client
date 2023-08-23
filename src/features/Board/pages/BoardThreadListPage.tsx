import {boards} from "@/constants";
import {AllThreadList, FixedThreadList, NewThreadButton} from "@/features/Board/components";
import {useFullHeight} from "@/hooks";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {useNavigate, useParams} from "react-router-dom";

export default function BoardThreadListPage() {
  const {boardId} = useParams();
  const navigate = useNavigate();

  const {containerRef} = useFullHeight();

  const onGoBack = () => navigate(-1);

  return (
    <div
      ref={containerRef}
      className="mobile-view h-full relative z-[2000] bg-[#EFEFEF] flex flex-col">
      <div className="relative w-full h-[56px] px-6 flex flex-row justify-center items-center bg-[white] border-b-[2px] border-[#2D3648]">
        <button className="absolute left-6" onClick={onGoBack}>
          <LeftArrowIcon width="22" height="22" />
        </button>
        <div className="flex flex-row items-center gap-2">
          <span className="text-[22px] text-[#171717] font-[700]">{boards[boardId!]?.name}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center overflow-y-auto gap-2">
        <div
          className="w-full px-6 py-3 whitespace-pre text-[16px] text-[#A5A5A5] font-[700] bg-[white]"
          style={{boxShadow: "0px -2px 9px 0px rgba(0, 0, 0, 0.25)"}}>
          {boards[boardId!]?.description}
        </div>
        <FixedThreadList boardId={boardId!} />
        <AllThreadList boardId={boardId!} />
      </div>
      <NewThreadButton boardId={boardId!} />
    </div>
  );
}
