import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  isDeleting: boolean;
  onConfirm?: () => void;
};

export default function DeleteBookDialog({
  isDeleting,
  onConfirm = () => {},
  onRequestClose,
  ...props
}: Props) {
  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-0 right-0 mx-2 min-[480px]:mx-auto my-auto min-[480px]:w-[450px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-stretch overflow-hidden"
      closeTimeoutMS={200}
      appElement={document.getElementById("root") as HTMLElement}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      {...props}>
      <div className="px-5 py-2 overflow-y-auto flex flex-col gap-1 border-b border-[#242424]">
        <h1 className="font-bold text-[22px]">작품 완전삭제</h1>
      </div>

      <div className="px-5 py-2">
        <span className="text-[18px] font-bold">작품을 완전히 삭제하시겠어요?</span>

        <ul className="ps-4 py-1">
          <li className="list-disc list-outside">
            한 번 삭제한 작품은 다시 <b>복구할 수 없어요</b>!
          </li>
          <li className="list-disc list-outside">
            이미 공개되어 있는 작품도 <b>완전히 삭제</b>될 거예요...
          </li>
          <li className="list-disc list-outside">
            작품에 남겨진 <b>댓글, 좋아요도 모두 삭제</b>될 거에요!
          </li>
          <li className="list-disc list-outside">
            잠깐 독자들한테서 감추고 싶으신거라면 완전삭제보다 <b>비공개하기</b>를 추천드릴게요!
          </li>
        </ul>
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black">
        <button
          className="w-full h-full bg-white text-[#171717] disabled:text-[#888888]"
          onClick={onRequestClose}
          disabled={isDeleting}>
          취소
        </button>
        <button
          className="w-full h-full bg-[#242424] text-white disabled:text-[#888888]"
          onClick={onConfirm}
          disabled={isDeleting}>
          작품 완전삭제하기
        </button>
      </div>
    </ReactModal>
  );
}
