import {DesktopAppBar, FlatButton, Modal, SizedBox} from "@/components";
import {DashboardBookList} from "@/features/Dashboard/components";
import {useProfile} from "@/features/Member/hooks";
import {useAuthGuard, useMobileViewGuard, useModal} from "@/hooks";

export default function DashboardPage() {
  const {isOpen, openModal, closeModal} = useModal();
  const {profile} = useProfile();

  const {RequestSignInDialog} = useAuthGuard();
  const {MobileViewAlert} = useMobileViewGuard();

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content p-6">
        <div className="flex flex-row justify-between items-center">
          <span className="text-[28px] font-bold">{profile?.penName ?? "작가"}님의 작품들</span>
          <FlatButton className="!w-fit px-[20px]" onClick={openModal}>
            새 작품 만들기 +
          </FlatButton>
        </div>
        <div className="mt-4 self-stretch border-t-2 border-[#2D3648]" />
        <SizedBox height={24} />
        {profile ? <DashboardBookList memberId={profile.id} /> : null}
      </div>

      <Modal.CreateBookAgreement isOpen={isOpen} onRequestClose={closeModal} />
      <MobileViewAlert />
      <RequestSignInDialog />
    </div>
  );
}
