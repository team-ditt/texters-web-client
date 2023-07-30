import {SizedBox} from "@/components";
import {ReactComponent as NotFound404Icon} from "assets/icons/404.svg";
import {useNavigate} from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const onGoHome = () => navigate("/");

  return (
    <div className="mobile-view justify-center items-center">
      <NotFound404Icon />
      <SizedBox height={32} />
      <h1 className="text-center font-bold text-[30px]">페이지를 찾을 수 없어요!</h1>
      <SizedBox height={32} />
      <p className="leading-[1.4rem] whitespace-pre text-center">
        찾으려는 페이지의 주소가 잘못 입력되었거나,{"\n"}
        주소의 변경 혹은 삭제로 인해 찾을 수 없는 페이지에요.{"\n"}
        주소가 정확한지 다시 한 번 확인해 주세요!
      </p>
      <SizedBox height={24} />
      <button className="bg-[#171717] text-white px-4 py-2 rounded-md" onClick={onGoHome}>
        홈으로 돌아가기
      </button>
    </div>
  );
}
