import {Modal} from "@/components/Modal";
import {useDidSignIn, useSignOut} from "@/features/Auth/hooks";
import {useModal} from "@/hooks";
import {ReactComponent as SignInIcon} from "assets/icons/sign-in.svg";
import {ReactComponent as SignOutIcon} from "assets/icons/sign-out.svg";
import {Link} from "react-router-dom";

export default function AppBarSignInOutButton() {
  const didSignIn = useDidSignIn();
  const {mutate: signOut} = useSignOut();
  const {isOpen, openModal, closeModal} = useModal();

  if (didSignIn)
    return (
      <>
        <button className="p-1.5" onClick={openModal}>
          <SignOutIcon />
        </button>
        <Modal.Dialog
          isOpen={isOpen}
          title="로그아웃하시겠어요?"
          confirmMessage="로그아웃하기"
          onConfirm={signOut}
          onCancel={closeModal}
        />
      </>
    );

  return (
    <Link className="p-1.5" to="/sign-in">
      <SignInIcon />
    </Link>
  );
}
