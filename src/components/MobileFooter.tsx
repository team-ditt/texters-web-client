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
        <div className="flex flex-col gap-2">
          <ul className="flex gap-2 font-bold text-[0.75rem] text-[#A5A5A5]">
            <Link className="min-w-[4rem]" to="/terms-and-conditions">
              이용약관
            </Link>
            <Link className="min-w-[4rem]" to="/privacy-policy">
              개인정보 처리방침
            </Link>
            {didSignIn ? (
              <button className="min-w-[4rem]" onClick={openModal}>
                회원탈퇴
              </button>
            ) : null}
          </ul>
          <ul className="flex gap-2 font-bold text-[0.75rem] text-[#A5A5A5]">
            <span className="min-w-[4rem]">고객문의</span>
            <Link
              className="w-fit min-w-[4rem] border-b border-[#A5A5A5]"
              to="mailto:support@texters.io">
              teamdiff.texters@gmail.com
            </Link>
          </ul>
          <ul className="flex gap-2 font-bold text-[0.75rem] text-[#A5A5A5]">
            <span className="min-w-[4rem]">업무제휴 문의</span>
            <Link className="w-fit border-b border-[#A5A5A5]" to="mailto:help@texters.io">
              teamdiff.texters@gmail.com
            </Link>
          </ul>
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
