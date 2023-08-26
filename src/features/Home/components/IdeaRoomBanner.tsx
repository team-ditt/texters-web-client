import {useNavigate} from "react-router";

export default function IdeaRoomCard() {
  const BOARD_ID = "idea";

  const navigate = useNavigate();
  const onNavigate = () => {
    navigate(`/boards/${BOARD_ID}/threads`);
  };

  return (
    <div className="self-center w-full max-w-[560px] p-10 flex flex-col">
      <span className={`text-[32px] font-bold text-[#191919] mb-[30px]`}>
        텍스터들의 아이디어가 실현되는 이곳!
      </span>
      <span className={`text-[16px] text-[#5C5C5B] mb-[45px]`}>
        좋은 아이디어나, 사소하지만 불편했던 점들, 저희가 발견하지 못한 버그까지!
        <br />
        여기 <span className="font-bold">‘아이디어룸'</span>에서 자유롭게 이야기 나눠주세요, 저희가
        최대한 반영하도록 노력할게요!
      </span>
      <div className="p-[5px]">
        <button
          onClick={onNavigate}
          className={`text-white font-bold text-[16px] w-full bg-[#1A202C] px-4 py-2 rounded-md`}>
          아이디어룸 입장하기
        </button>
      </div>
    </div>
  );
}
