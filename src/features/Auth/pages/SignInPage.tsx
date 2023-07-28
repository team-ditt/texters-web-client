import {SizedBox, SpinningLoader} from "@/components";
import {useOauthSignIn} from "@/features/Auth/hooks";
import {useAuthStore} from "@/stores";
import {ReactComponent as CloseIcon} from "assets/icons/close.svg";
import googleLogo from "assets/icons/google-logo.png";
import kakaoLogo from "assets/icons/kakao-logo.png";
import naverLogo from "assets/icons/naver-logo.png";
import {ReactComponent as LogoPositive} from "assets/logo/logo-positive.svg";
import {ReactComponent as LogoSymbol} from "assets/logo/logo-symbol.svg";
import {motion} from "framer-motion";
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const {didSignIn} = useAuthStore();

  const {KAKAO_LOGIN_URI, NAVER_LOGIN_URI, GOOGLE_LOGIN_URI, isSigningIn} = useOauthSignIn();

  const onClose = () => navigate(-1);

  useEffect(() => {
    if (didSignIn()) navigate("/", {replace: true});
  }, [didSignIn()]);

  return (
    <motion.div
      className="mobile-view fixed left-auto right-auto h-full p-6 justify-center items-center z-[2000]"
      initial={{top: "100%"}}
      animate={{top: 0}}
      exit={{top: "100%"}}>
      <button className="absolute left-6 top-6" onClick={onClose}>
        <CloseIcon />
      </button>

      <div className="w-full max-w-[336px] flex flex-col">
        <LogoSymbol className="self-center" width={112} />
        <SizedBox height={16} />
        <LogoPositive className="self-center" width={146} />
        <SizedBox height={72} />
        <Link
          className="h-12 flex justify-center items-center rounded-[10px] shadow-[0_2px_3px_rgba(0,0,0,0.168)] text-black-500"
          to={GOOGLE_LOGIN_URI}>
          <img className="w-5 h-5" src={googleLogo} />
          <SizedBox width={12} />
          구글로 로그인 하기
        </Link>
        <SizedBox height={16} />
        <Link
          className="h-12 flex justify-center items-center rounded-[10px] bg-[#03C75A] shadow-[0_2px_3px_rgba(0,0,0,0.168)] text-white"
          to={NAVER_LOGIN_URI}>
          <img className="w-4 h-4" src={naverLogo} />
          <SizedBox width={12} />
          네이버로 로그인 하기
        </Link>
        <SizedBox height={16} />
        <Link
          className="h-12 flex justify-center items-center rounded-[10px] bg-[#FFE500] shadow-[0_2px_3px_rgba(0,0,0,0.168)]"
          to={KAKAO_LOGIN_URI}>
          <img className="w-5 h-5" src={kakaoLogo} />
          <SizedBox width={12} />
          카카오로 로그인 하기
        </Link>
      </div>

      {isSigningIn ? (
        <div className="absolute left-0 top-0 w-full max-w-[850px] h-full bg-white opacity-50 flex justify-center items-center">
          <SpinningLoader color="#666666" />
        </div>
      ) : null}
    </motion.div>
  );
}
