import {useNavigate} from "react-router";

export default function BookHelpCard() {
  const navigate = useNavigate();
  const onNavigateStudio = () => {
    navigate(`/studio/dashboard`);
  };

  return (
    <div className="bg-[#E2E7F0] flex justify-center">
      <div className="self-center w-full max-w-[560px] p-10 flex flex-col">
        <span className={`text-[32px] font-bold text-[#191919] mb-[12px]`}>
          작품 만들기가 처음이세요...?
        </span>
        <span className={`text-[16px] text-[#5C5C5B] mb-[45px]`}>
          작품 만들기가 처음이세요? 걱정하지 마세요!
          <br />
          여러분을 위해 작품생성부터 작품공개까지, 하나하나 친절히 설명해뒀답니다!
        </span>
        <div className="p-[5px] flex flex-col min-[480px]:flex-row gap-3">
          <a
            href="https://www.notion.so/texters/620859e89f6d49ebbbe92fd28a2b7a5f?pvs=4#f34071603e1943ee9e85083f5680415e"
            target="_blank"
            className={`text-white font-bold text-[16px] w-full bg-[#4A5468] px-4 py-2 rounded-md text-center`}>
            작품 쓰는 법!
          </a>
          <button
            onClick={onNavigateStudio}
            className={`text-white font-bold text-[16px] w-full bg-[#1A202C] px-4 py-2 rounded-md`}>
            작품 쓰러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
