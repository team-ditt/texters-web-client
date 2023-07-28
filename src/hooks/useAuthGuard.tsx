import {Modal} from "@/components";
import useModal from "@/hooks/useModal";
import {useAuthStore} from "@/stores";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useAuthGuard() {
  const {didSignIn} = useAuthStore();
  const navigate = useNavigate();
  const {isOpen, openModal, closeModal} = useModal();

  const onConfirm = () => {
    closeModal();
    navigate("/sign-in", {replace: true});
  };
  const onCancel = () => {
    closeModal();
    navigate("/", {replace: true});
  };

  const RequestSignInDialog = () => (
    <Modal.Dialog
      isOpen={isOpen}
      title="로그인하시겠어요?"
      message="로그인이 필요한 서비스에요!"
      confirmMessage="로그인하기"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );

  useEffect(() => {
    if (didSignIn()) return;
    openModal();
  }, []);

  return {RequestSignInDialog};
}
