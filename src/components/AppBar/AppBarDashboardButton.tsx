import {Modal} from "@/components/Modal";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useModal} from "@/hooks";
import {Validator} from "@/utils";
import {ReactComponent as ToDashboardIcon} from "assets/icons/to-dashboard.svg";
import {useNavigate} from "react-router-dom";

export default function AppBarDashboardButton() {
  const didSignIn = useDidSignIn();
  const navigate = useNavigate();

  const {
    isOpen: isMobileGuardOpen,
    openModal: openMobileGuardModal,
    closeModal: closeMobileGuardModal,
  } = useModal();
  const {
    isOpen: isRequestSignInOpen,
    openModal: openRequestSignInModal,
    closeModal: closeRequestSignInModal,
  } = useModal();

  const onNavigateToDashboard = () => {
    if (Validator.isMobileDevice(navigator.userAgent)) return openMobileGuardModal();
    if (!didSignIn) return openRequestSignInModal();
    navigate("/studio/dashboard");
  };
  const onConfirmSignIn = () => {
    closeRequestSignInModal();
    navigate("/sign-in");
  };

  return (
    <>
      <button className="p-1.5" onClick={onNavigateToDashboard}>
        <ToDashboardIcon />
      </button>
      <Modal.Alert
        isOpen={isMobileGuardOpen}
        title="모바일은 안돼요!"
        message="텍스터즈 스튜디오는 PC환경에서만 사용 가능해요!"
        onRequestClose={closeMobileGuardModal}
      />
      <Modal.Dialog
        isOpen={isRequestSignInOpen}
        title="로그인하시겠어요?"
        message="텍스터즈 스튜디오는 로그인 후 사용할 수 있어요!"
        confirmMessage="로그인하기"
        onConfirm={onConfirmSignIn}
        onCancel={closeRequestSignInModal}
      />
    </>
  );
}
