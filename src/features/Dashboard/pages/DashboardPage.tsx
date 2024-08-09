import {FlatButton, Modal, SizedBox} from "@/components";
import DashboardBookList from "@/features/Dashboard/components/DashboardBookList";
import {useProfile} from "@/features/Member/hooks";
import {useAuthGuard, useModal} from "@/hooks";
import {Validator} from "@/utils";
import {ReactComponent as PlusIcon} from "assets/icons/plus.svg";
import {useNavigate} from "react-router-dom";
import LoadBookDialog from "../components/LoadBookDialog";

export default function DashboardPage() {
  const {isOpen, openModal, closeModal} = useModal();
  // const {profile} = useProfile();
  const isMobileDevice = Validator.isMobileDevice(navigator.userAgent) && window.screen.width < 768;

  // const {RequestSignInDialog} = useAuthGuard();
  const navigate = useNavigate();
  const onClick = () => navigate("/studio/books/info");

  const {
    isOpen: isLoadModalOpen,
    openModal: openLoadModal,
    closeModal: closeLoadModal,
  } = useModal();

  return (
    <div className="mobile-view p-6 pt-16">
      <div className="flex flex-row justify-between items-center">
        <span className="me-4 text-[24px] font-bold">작가님의 작품들</span>
        <button
          className="flex items-center ml-auto mr-4 gap-1.5 font-semibold text-[14px] ps-4 pe-5 h-7 rounded-md border-[2px] border-black text-black"
          onClick={openLoadModal}>
          작품 불러오기
        </button>
        {isMobileDevice ? null : (
          <FlatButton className="!w-fit !h-[40px] px-[20px] whitespace-pre" onClick={onClick}>
            새 작품 만들기
          </FlatButton>
        )}
      </div>
      <div className="mt-2 self-stretch border-t-2 border-[#2D3648]" />
      <SizedBox height={24} />
      <DashboardBookList />

      {isMobileDevice ? (
        <button
          className="fixed right-4 bottom-4 w-12 h-12 flex justify-center items-center rounded-full font-bold text-[22px] text-white bg-[#242424] active:bg-[#111111] transition-colors"
          onClick={onClick}>
          <PlusIcon />
        </button>
      ) : null}

      <LoadBookDialog isOpen={isLoadModalOpen} onRequestClose={closeLoadModal} />

      {/* <Modal.CreateBookAgreement isOpen={isOpen} onRequestClose={closeModal} /> */}
      {/* <RequestSignInDialog /> */}
    </div>
  );
}
