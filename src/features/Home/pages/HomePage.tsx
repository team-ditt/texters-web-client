import {useAuthStore} from "@/stores";
import {useEffect} from "react";
import {Link} from "react-router-dom";

export default function HomePage() {
  const {accessToken} = useAuthStore();

  useEffect(() => {
    if (accessToken) console.log("login success");
  }, [accessToken]);

  return (
    <div className="page-container gap-[16px] items-stretch">
      홈 화면
      <Link className="px-4 py-2 bg-blue-primary text-white rounded-md self-center" to="/login">
        로그인 페이지 이동
      </Link>
    </div>
  );
}
