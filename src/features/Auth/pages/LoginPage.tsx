import {Link} from "react-router-dom";

export default function LoginPage() {
  const KAKAO_LOGIN_URI =
    "https://kauth.kakao.com/oauth/authorize?" +
    new URLSearchParams([
      ["client_id", import.meta.env.VITE_KAKAO_CLIENT_ID],
      ["redirect_uri", `${import.meta.env.VITE_CLIENT_URL}/login/oauth/kakao`],
      ["response_type", "code"],
    ]).toString();
  const NAVER_LOGIN_URI =
    "https://nid.naver.com/oauth2.0/authorize?" +
    new URLSearchParams([
      ["client_id", import.meta.env.VITE_NAVER_CLIENT_ID],
      ["redirect_uri", `${import.meta.env.VITE_CLIENT_URL}/login/oauth/naver`],
      ["response_type", "code"],
    ]).toString();
  const GOOGLE_LOGIN_URI =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams([
      ["client_id", import.meta.env.VITE_GOOGLE_CLIENT_ID],
      ["redirect_uri", `${import.meta.env.VITE_CLIENT_URL}/login/oauth/google`],
      ["response_type", "code"],
      ["scope", "https://www.googleapis.com/auth/userinfo.email"],
    ]).toString();

  return (
    <div className="page-container gap-[16px] items-stretch">
      <Link
        className="px-4 py-2 bg-yellow-300 text-black-800 rounded-md font-bold text-center"
        to={KAKAO_LOGIN_URI}>
        카카오 로그인
      </Link>
      <Link
        className="px-4 py-2 bg-green-500 text-black-800 rounded-md font-bold text-center"
        to={NAVER_LOGIN_URI}>
        네이버 로그인
      </Link>
      <Link
        className="px-4 py-2 bg-gray-200 text-black-800 rounded-md font-bold text-center"
        to={GOOGLE_LOGIN_URI}>
        구글 로그인
      </Link>
    </div>
  );
}
