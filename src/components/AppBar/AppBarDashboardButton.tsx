import {Modal} from "@/components/Modal";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useModal} from "@/hooks";
import {ReactComponent as ToDashboardIcon} from "assets/icons/to-dashboard.svg";
import {useNavigate} from "react-router-dom";

export default function AppBarDashboardButton() {
  const didSignIn = useDidSignIn();
  const navigate = useNavigate();

  const {
    isOpen: isRequestSignInOpen,
    openModal: openRequestSignInModal,
    closeModal: closeRequestSignInModal,
  } = useModal();

  const onNavigateToDashboard = () => {
    if (!didSignIn) return openRequestSignInModal();
    navigate("/studio/dashboard");
  };
  const onConfirmSignIn = () => {
    closeRequestSignInModal();
    navigate("/sign-in");
  };

  return (
    <>
      <button className="p-1.5 tooltip" onClick={onNavigateToDashboard}>
        <ToDashboardIcon />
        <span className="tooltip-text">텍스터즈 스튜디오</span>
      </button>

      <Modal.Dialog
        isOpen={isRequestSignInOpen}
        title="로그인하시겠어요?"
        message="텍스터즈 스튜디오는 로그인 후 사용할 수 있어요! 작품을 작성하려면 로그인해주세요!"
        confirmMessage="로그인하기"
        onConfirm={onConfirmSignIn}
        onCancel={closeRequestSignInModal}
      />
    </>
  );
}
