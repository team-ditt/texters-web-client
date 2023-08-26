import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  isPublishing: boolean;
  onConfirm?: () => void;
};

export default function PublishBookDialog({
  isPublishing,
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
        <h1 className="font-bold text-[22px]">작품 공개</h1>
      </div>

      <div className="px-5 py-2">
        <span className="text-[18px] font-bold">
          작품을 다 만드셨군요!
          <br />
          이대로 독자들에게 공개할까요?
        </span>

        <ul className="ps-4 py-1">
          <li className="list-disc list-outside">
            작품을 공개한 후에도 언제든지 수정할 수 있어요!
          </li>
          <li className="list-disc list-outside">
            바꾸고 싶은 부분이 생길 때마다 자유롭게 수정해보세요. 업데이트 버튼을 누르기 전까지는
            독자들에게 보이지 않으니 걱정 마세요!
          </li>
          <li className="list-disc list-outside">
            새로운 내용을 공개하고 싶을 때 업데이트 버튼을 눌러 수정사항을 반영할 수 있어요!
          </li>
        </ul>
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black">
        <button
          className="w-full h-full bg-white text-[#171717] disabled:text-[#888888]"
          onClick={onRequestClose}
          disabled={isPublishing}>
          취소
        </button>
        <button
          className="w-full h-full bg-[#242424] text-white disabled:text-[#888888]"
          onClick={onConfirm}
          disabled={isPublishing}>
          작품 공개하기
        </button>
      </div>
    </ReactModal>
  );
}
