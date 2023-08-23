import {Modal} from "@/components";
import useModal from "@/hooks/useModal";
import {useRef, useState} from "react";

type CheckFunctionType = (password: string) => Promise<unknown>;
type CallbackTypes = {
  onSuccess?: (password: string) => unknown;
  onFail?: (password?: string) => unknown;
};
type PasswordPromptProps = {title?: string; message?: string};
export default function usePasswordCheck(checkFunction: CheckFunctionType) {
  const {isOpen, openModal, closeModal} = useModal();
  const [isChecking, setIsChecking] = useState(false);

  const callbacksRef = useRef<CallbackTypes>();

  const checkPassword = ({onSuccess, onFail}: CallbackTypes) => {
    if (isChecking) return;
    callbacksRef.current = {onSuccess, onFail};
    openModal();
  };

  const onConfirm = async (password: string) => {
    closeModal();
    const callbacks = callbacksRef.current;
    if (!callbacks) return;
    const {onSuccess, onFail} = callbacks;
    setIsChecking(true);
    try {
      await checkFunction(password);
      onSuccess?.(password);
    } catch {
      onFail?.(password);
    } finally {
      setIsChecking(false);
    }
  };

  const onCancel = () => {
    closeModal();
    const callbacks = callbacksRef.current;
    if (!callbacks) return;
    const {onFail} = callbacks;
    onFail?.();
  };

  const PasswordPrompt = ({title, message}: PasswordPromptProps) => (
    <Modal.PasswordPrompt
      isOpen={isOpen}
      title={title}
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );

  return {checkPassword, PasswordPrompt};
}
