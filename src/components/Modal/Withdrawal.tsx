import {api} from "@/api";
import Alert from "@/components/Modal/Alert";
import SizedBox from "@/components/SizedBox";
import {keys} from "@/constants";
import {useAuthStore} from "@/stores";
import {useMutation, useQuery} from "@tanstack/react-query";
import ReactModal from "react-modal";

type Props = ReactModal.Props;

export default function Withdrawal({onRequestClose, ...props}: Props) {
  const {didSignIn, removeToken} = useAuthStore();
  const {data: profile} = useQuery([keys.GET_MY_PROFILE], api.members.fetchProfile, {
    enabled: didSignIn(),
  });
  const {
    mutate: withdraw,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useMutation({
    mutationFn: () => api.members.withdraw(profile!.id),
  });
  const onSuccess = () => {
    removeToken();
    window.location.href = "/";
  };

  return (
    <>
      <ReactModal
        overlayClassName="fixed inset-0 bg-overlay z-[12000]"
        className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[650px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-center overflow-hidden"
        closeTimeoutMS={200}
        onRequestClose={onRequestClose}
        appElement={document.getElementById("root") as HTMLElement}
        {...props}>
        <div className="w-full flex flex-col items-start gap-[6px] px-8 py-4">
          <span className="text-[30px] font-bold whitespace-pre">
            진짜...{"\n"}탈퇴하실 거에요?
          </span>
        </div>
        <div className="w-full border-t border-[#D9D9D9]" />

        <div className="w-full px-12 pe-8 py-6 overflow-y-auto">
          <span className="-m-4">탈퇴하기 전에 아래 내용을 확인해주세요!</span>
          <SizedBox height={16} />
          <ul>
            <li className="list-disc list-outside">
              당신이 열심히 쓴 작품... 직접 지우고 가야해요
            </li>
            <li className="list-disc list-outside">모든 작품을 직접 삭제해야 탈퇴가 가능해요</li>
            <li className="list-disc list-outside">
              스스로 작품을 지우는 순간, 우리 서버에서도 <b>[영.원.히]</b> 사라져요
            </li>
          </ul>
          <SizedBox height={16} />
          <span className="-m-4">그래도 탈퇴하신다면 쿨하게 보내드릴게요...</span>
        </div>

        <div className="flex self-stretch border-t-[1.5px] border-black">
          <button
            className="w-full h-12 bg-white text-[#171717]"
            onClick={() => withdraw()}
            disabled={isLoading}>
            진짜 탈퇴하기
          </button>
          <button className="w-full h-12 bg-[#242424] text-white" onClick={onRequestClose}>
            그만두기
          </button>
        </div>
      </ReactModal>
      <Alert
        isOpen={isError}
        title="삭제하지 않은 작품이 있어요"
        message="모든 작품을 직접 삭제해야 탈퇴가 가능해요!"
        onRequestClose={reset}
      />
      <Alert
        isOpen={isSuccess}
        IconComponent={null}
        title="탈퇴신청에 성공했어요"
        message="그동안 즐거웠어요! 우리 꼭 다시 만나요!"
        onRequestClose={onSuccess}
      />
    </>
  );
}
