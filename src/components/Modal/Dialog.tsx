import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  showClose?: boolean;
  title?: string;
  message?: string;
  confirmMessage?: string;
  cancelMessage?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function Dialog({
  title = "경고",
  message = "",
  confirmMessage = "확인",
  cancelMessage = "취소",
  onConfirm = () => {},
  onCancel = () => {},
  onRequestClose,
  ...props
}: Props) {
  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto w-[300px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-center overflow-hidden"
      closeTimeoutMS={200}
      appElement={document.getElementById("root") as HTMLElement}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      {...props}>
      {onRequestClose ? (
        <button className="absolute top-2 right-2 p-1" onClick={onRequestClose}>
          <CloseModalIcon width={28} height={28} />
        </button>
      ) : null}
      <div className="w-full p-6 overflow-y-auto flex flex-col items-center gap-1">
        <h1 className="font-bold text-[20px] text-center">{title}</h1>
        {message ? <p className="text-[#A5A5A5] text-center">{message}</p> : null}
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black">
        <button className="w-full h-full bg-white text-[#171717]" onClick={onCancel}>
          {cancelMessage}
        </button>
        <button className="w-full h-full bg-[#242424] text-white" onClick={onConfirm}>
          {confirmMessage}
        </button>
      </div>
    </ReactModal>
  );
}
