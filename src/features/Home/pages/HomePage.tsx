import {api} from "@/api";
import {keys} from "@/constants";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";

export default function HomePage() {
  const {accessToken} = useAuthStore();
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: !!accessToken,
  });

  return (
    <div className="page-container gap-[16px] items-stretch">
      홈 화면
      {profile ? (
        <>
          <span>로그인 사용자 : {profile.penName}</span>
          <button>로그아웃</button>
        </>
      ) : (
        <Link className="px-4 py-2 bg-blue-primary text-white rounded-md self-center" to="/login">
          로그인 페이지 이동
        </Link>
      )}
    </div>
  );
}
