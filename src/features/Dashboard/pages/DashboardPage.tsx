import {api} from "@/api";
import {DesktopAppBar, FlatButton, Modal, SizedBox} from "@/components";
import {keys} from "@/constants";
import {DashboardBookList} from "@/features/Dashboard/components";
import {useAuthGuard, useMobileViewGuard, useModal} from "@/hooks";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";

export default function DashboardPage() {
  const {isOpen, openModal, closeModal} = useModal();
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: didSignIn,
  });

  useAuthGuard();
  useMobileViewGuard(didSignIn);

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content p-6">
        <div className="flex flex-row justify-between items-center">
          <span className="text-[28px] font-bold">{profile?.penName ?? "작가"}님의 작품들</span>
          <FlatButton className="w-fit px-[20px]" onClick={openModal}>
            새 작품 만들기 +
          </FlatButton>
        </div>
        <div className="mt-4 self-stretch border-t-2 border-[#2D3648]" />
        <SizedBox height={24} />
        {profile ? <DashboardBookList memberId={profile.id} /> : null}
      </div>
      <Modal.CreateBookAgreement isOpen={isOpen} onRequestClose={closeModal} />
    </div>
  );
}