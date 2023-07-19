import {ReactComponent as DiscordLogoIcon} from "assets/icons/discord-logo.svg";
import {Link} from "react-router-dom";

export default function MobileFooter() {
  return (
    <div className="flex flex-col">
      <div className="px-12 py-6 bg-[#3A3A3A] flex justify-between items-center">
        <div className="flex gap-2">
          <ul className="flex flex-col gap-[12px] font-bold text-[12px] text-[#A5A5A5]">
            <span>이용약관</span>
            <span>고객문의</span>
            <span>업무제휴 문의</span>
          </ul>
          <ul className="flex flex-col gap-[12px] font-bold text-[12px] text-[#A5A5A5]">
            <span>개인정보 처리방침</span>
            <Link className="underline" to="mailto:help@texters.io">
              help@texters.io
            </Link>
            <Link className="underline" to="mailto:support@texters.io">
              support@texters.io
            </Link>
          </ul>
        </div>
        <DiscordLogoIcon />
      </div>
      <span className="py-6 border-t border-[#757575] bg-[#2D2D2D] flex justify-center items-center font-bold text-[12px] text-[#A5A5A5]">
        Copyright © Texters 2023. All Rights Reserved.
      </span>
    </div>
  );
}
