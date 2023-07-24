import FlatButton from "@/components/FlatButton";
import SizedBox from "@/components/SizedBox";
import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import ReactModal from "react-modal";
import {useNavigate} from "react-router-dom";

type Props = ReactModal.Props;

export default function CreateBookAgreement({onRequestClose, ...props}: Props) {
  const navigate = useNavigate();

  const onAgree = () => navigate("/studio/books/info");

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[650px] h-fit max-h-[600px] outline-none bg-white rounded-[12px] flex flex-col items-center"
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root") as HTMLElement}
      {...props}>
      <button className="self-end mt-4 mr-4" onClick={onRequestClose}>
        <CloseModalIcon />
      </button>

      <SizedBox height={12} />
      <div className="w-full flex flex-col items-start gap-[6px] px-8 pb-8">
        <span className="text-[30px] font-bold text-[#494949]">작품 제작 전 동의사항</span>
      </div>
      <div className="w-full border-t border-[#D9D9D9]" />

      <div className="w-full ps-12 pe-8 py-6 overflow-y-auto">
        <span className="font-bold text-[22px] -ms-4">작품</span>
        <SizedBox height={8} />
        <ul>
          <li className="list-disc list-outside">
            현재 텍스터즈에서는 성인물 카테고리를 따로 개발중에 있어요.
          </li>
          <li className="list-disc list-outside">
            성인물 카테고리 개발이 완료되기 전까지,{" "}
            <b>과도한 성적묘사 및 고어한 표현이 담긴 작품은 운영진의 판단아래 작품 공개가 취소</b>될
            수 있어요.
          </li>
        </ul>
        <SizedBox height={8} />
        <span className="font-bold text-[22px] -ms-4">표지</span>
        <SizedBox height={8} />
        <ul>
          <li className="list-disc list-outside">
            표지는 <b>작가 본인에게 저작권이 있거나 상업적 이용이 가능</b>해야 해요.
          </li>
          <li className="list-disc list-outside">
            추후에 표지와 관련해 문제가 생길 시, 임의로 삭제되거나 기본 표지로 대체될 수 있어요.
          </li>
          <li className="list-disc list-outside">
            표지와 관련된 어떠한 문제에 대해서 텍스터즈는 책임지지 않으니 반드시 위 내용을 숙지하고
            올려주세요.
          </li>
        </ul>
      </div>

      <div className="w-full px-8 pt-4 pb-8">
        <FlatButton className="!h-12" onClick={onAgree}>
          <span>동의하고 계속하기</span>
        </FlatButton>
      </div>
    </ReactModal>
  );
}