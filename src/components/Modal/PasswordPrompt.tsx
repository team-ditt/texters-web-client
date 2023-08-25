import {ReactComponent as CloseModalIcon} from "assets/icons/close-modal.svg";
import {ReactComponent as ViewedIcon} from "assets/icons/viewed.svg";
import classNames from "classnames";
import {ChangeEvent, KeyboardEvent, useState} from "react";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  showClose?: boolean;
  title?: string;
  message?: string;
  confirmMessage?: string;
  cancelMessage?: string;
  onConfirm: (password: string) => void;
  onCancel?: () => void;
};

const INVALID_CHARS = ["-", "+", "E", "e", "."];

export default function PasswordPrompt({
  title = "입력",
  message = "",
  confirmMessage = "확인",
  cancelMessage = "취소",
  onConfirm = (password: string) => {},
  onCancel = () => {},
  onRequestClose,
  ...props
}: Props) {
  const MIN_PASSWORD_LENGTH = 4;
  const MAX_PASSWORD_LENGTH = 8;

  const [password, setPassword] = useState("");
  const onInputPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    if (text.length > MAX_PASSWORD_LENGTH || INVALID_CHARS.some(c => text.includes(c))) return;
    setPassword(text);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (INVALID_CHARS.includes(event.key)) event.preventDefault();
  };

  const [exposePassword, setExposePassword] = useState(false);
  const toggleExposePassword = () => setExposePassword(!exposePassword);

  const isValid =
    password.length === 0 ||
    (password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH);
  const onClickConfirm = () => onConfirm(password);

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[300px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-center overflow-hidden"
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

      <div className="w-full px-6 py-2 mb-2">
        <div className="relative">
          <input
            className={classNames("w-full border-b border-gray", {
              "number-password-input": !exposePassword,
            })}
            type="number"
            inputMode="numeric"
            placeholder="숫자 4~8자리"
            value={password}
            onInput={onInputPassword}
            onKeyDown={onKeyDown}
          />

          <div
            className="absolute top-0 right-0 bottom-0 flex flex items-center"
            onClick={toggleExposePassword}>
            <ViewedIcon />
          </div>
        </div>
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black mt-2">
        <button className="w-full h-full bg-white text-[#171717]" onClick={onCancel}>
          {cancelMessage}
        </button>
        <button
          className="w-full h-full bg-[#242424] text-white disabled:bg-[#999999]"
          onClick={onClickConfirm}
          disabled={!isValid}>
          {confirmMessage}
        </button>
      </div>
    </ReactModal>
  );
}
