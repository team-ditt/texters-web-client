import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  isUpdating: boolean;
  onConfirm?: () => void;
};

export default function UpdateBookDialog({
  isUpdating,
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
        <h1 className="font-bold text-[22px]">작품 업데이트</h1>
      </div>

      <div className="px-5 py-2">
        <span className="text-[18px] font-bold">독자들에게 새로운 내용을 공개할까요?</span>

        <ul className="ps-4 py-1">
          <li className="list-disc list-outside">
            작가님이 지금까지 작업한 내용으로 새롭게 업데이트 될 거예요!
          </li>
          <li className="list-disc list-outside">
            작품 개요, 표지 이미지를 변경하고 싶을 때에도 업데이트를 눌러주세요!
          </li>
        </ul>
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black">
        <button
          className="w-full h-full bg-white text-[#171717] disabled:text-[#888888]"
          onClick={onRequestClose}
          disabled={isUpdating}>
          취소
        </button>
        <button
          className="w-full h-full bg-[#242424] text-white disabled:text-[#888888]"
          onClick={onConfirm}
          disabled={isUpdating}>
          작품 업데이트하기
        </button>
      </div>
    </ReactModal>
  );
}
