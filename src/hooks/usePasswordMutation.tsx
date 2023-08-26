import {Modal} from "@/components";
import useModal from "@/hooks/useModal";
import {PasswordForm} from "@/types/board";
import {useRef} from "react";

type PasswordPromptProps = {
  title?: string;
  message?: string;
  confirmMessage?: string;
  cancelMessage?: string;
};
export default function usePasswordMutation<Form extends PasswordForm>() {
  type MutationType = ((form: Form) => unknown) | (() => unknown);

  const {isOpen, openModal, closeModal} = useModal();

  const mutationRef = useRef<MutationType>();
  const formRef = useRef<Form>();

  const withPassword = (mutation: MutationType, form?: Form) => {
    mutationRef.current = mutation;
    formRef.current = form;
    openModal();
  };

  const onConfirm = (password: string) => {
    closeModal();
    const mutation = mutationRef.current;
    const form = formRef.current;
    if (!mutation) return;
    const passwordForm = {
      password: password.length > 0 ? password : undefined,
    } as Form;
    mutation({...form, ...passwordForm});
  };

  const PasswordPrompt = (props: PasswordPromptProps) => (
    <Modal.PasswordPrompt isOpen={isOpen} onConfirm={onConfirm} onCancel={closeModal} {...props} />
  );

  return {withPassword, PasswordPrompt};
}
