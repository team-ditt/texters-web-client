import {FlatButton, Modal, SizedBox} from "@/components";
import DashboardBookList from "@/features/Dashboard/components/DashboardBookList";
import {useProfile} from "@/features/Member/hooks";
import {useAuthGuard, useModal} from "@/hooks";
import {Validator} from "@/utils";
import {ReactComponent as PlusIcon} from "assets/icons/plus.svg";

export default function DashboardPage() {
  const {isOpen, openModal, closeModal} = useModal();
  const {profile} = useProfile();
  const isMobileDevice = Validator.isMobileDevice(navigator.userAgent) && window.screen.width < 768;

  const {RequestSignInDialog} = useAuthGuard();

  return (
    <div className="mobile-view p-6 pt-16">
      <div className="flex flex-row justify-between items-center">
        <span className="me-4 text-[24px] font-bold">{profile?.penName ?? "작가"}님의 작품들</span>
        {isMobileDevice ? null : (
          <FlatButton className="!w-fit !h-[40px] px-[20px] whitespace-pre" onClick={openModal}>
            새 작품 만들기
          </FlatButton>
        )}
      </div>
      <div className="mt-2 self-stretch border-t-2 border-[#2D3648]" />
      <SizedBox height={24} />
      {profile ? <DashboardBookList memberId={profile.id} /> : null}

      {isMobileDevice ? (
        <button
          className="fixed right-4 bottom-4 w-12 h-12 flex justify-center items-center rounded-full font-bold text-[22px] text-white bg-[#242424] active:bg-[#111111] transition-colors"
          onClick={openModal}>
          <PlusIcon />
        </button>
      ) : null}

      <Modal.CreateBookAgreement isOpen={isOpen} onRequestClose={closeModal} />
      <RequestSignInDialog />
    </div>
  );
}
