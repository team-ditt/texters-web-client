import {Modal} from "@/components";
import {useDidSignIn} from "@/features/Auth/hooks";
import useModal from "@/hooks/useModal";
import {Validator} from "@/utils";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function useMobileViewGuard() {
  const navigate = useNavigate();
  const didSignIn = useDidSignIn();
  const {isOpen, openModal, closeModal} = useModal();

  const onClose = () => {
    closeModal();
    navigate("/", {replace: true});
  };

  const MobileViewAlert = () => (
    <Modal.Alert
      isOpen={isOpen}
      title="모바일은 안돼요!"
      message="텍스터즈 스튜디오는 PC환경에서만 사용 가능해요! 작품을 작성하려면 PC를 이용해주세요!"
      onRequestClose={onClose}
    />
  );

  useEffect(() => {
    if (!didSignIn) return;
    if (!Validator.isMobileDevice(navigator.userAgent)) return;
    openModal();
  }, [didSignIn]);

  return {MobileViewAlert};
}
