import {Modal} from "@/components/Modal";
import {useDidSignIn} from "@/features/Auth/hooks";
import {useModal} from "@/hooks";
import {ReactComponent as DiscordLogoIcon} from "assets/icons/discord-logo.svg";
import {Link} from "react-router-dom";

export default function MobileFooter() {
  const didSignIn = useDidSignIn();
  const {isOpen, openModal, closeModal} = useModal();

  return (
    <div className="flex flex-col">
      <div className="px-12 py-6 bg-[#3A3A3A] flex justify-between items-center">
        <div className="flex gap-2">
          <ul className="flex flex-col gap-[12px] font-bold text-[12px] text-[#A5A5A5]">
            <Link to="/terms-and-conditions">이용약관</Link>
            <span>고객문의</span>
            <span>업무제휴 문의</span>
          </ul>
          <ul className="flex flex-col gap-[12px] font-bold text-[12px] text-[#A5A5A5]">
            <Link to="/privacy-policy">개인정보 처리방침</Link>
            <Link className="w-fit border-b border-[#A5A5A5]" to="mailto:help@texters.io">
              teamdiff.texters@gmail.com
            </Link>
            <Link className="w-fit border-b border-[#A5A5A5]" to="mailto:support@texters.io">
              teamdiff.texters@gmail.com
            </Link>
          </ul>
          {didSignIn ? (
            <ul className="flex flex-col gap-[12px] font-bold text-[12px] text-[#A5A5A5]">
              <button onClick={openModal}>회원탈퇴</button>
            </ul>
          ) : null}
        </div>
        <a href="https://discord.gg/wVmrzRfJ" target="_blank">
          <DiscordLogoIcon />
        </a>
      </div>
      <span className="py-6 border-t border-[#757575] bg-[#2D2D2D] flex justify-center items-center font-bold text-[12px] text-[#A5A5A5]">
        Copyright © Texters 2023. All Rights Reserved.
      </span>

      <Modal.Withdrawal isOpen={isOpen} onRequestClose={closeModal} />
    </div>
  );
}
