import {ReactComponent as AlertIcon} from "assets/icons/alert.svg";
import {ReactNode} from "react";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  showIcon?: boolean;
  IconComponent?: ReactNode;
  title?: string;
  message?: string;
  confirmMessage?: string;
  onConfirm?: () => void;
};

export default function Alert({
  showIcon = true,
  IconComponent = <AlertIcon></AlertIcon>,
  title = "경고",
  message = "",
  confirmMessage = "확인",
  onRequestClose,
  ...props
}: Props) {
  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto w-[300px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-center overflow-hidden"
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root") as HTMLElement}
      {...props}>
      <div className="w-full p-6 overflow-y-auto flex flex-col items-center gap-1">
        {showIcon ? IconComponent : null}
        <h1 className="font-bold text-[20px] text-center">{title}</h1>
        {message ? <p className="text-[#A5A5A5] text-center">{message}</p> : null}
      </div>

      <button className="w-full h-12 bg-[#242424] text-white" onClick={onRequestClose}>
        {confirmMessage}
      </button>
    </ReactModal>
  );
}
