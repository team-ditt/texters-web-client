import {api} from "@/api";
import {keys} from "@/constants";
import {useSignOut} from "@/features/Auth/hooks";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";

export default function HomePage() {
  const {accessToken} = useAuthStore();
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: !!accessToken,
  });
  const {mutate: signOut} = useSignOut();

  return (
    <div className="mobile-view">
      홈 화면
      {profile ? (
        <>
          <span>로그인 사용자 : {profile.penName}</span>
          <button className="px-4 py-2 rounded-md bg-black-200" onClick={signOut as () => void}>
            로그아웃
          </button>
        </>
      ) : (
        <Link className="px-4 py-2 bg-blue-primary text-white rounded-md self-center" to="/login">
          로그인 페이지 이동
        </Link>
      )}
    </div>
  );
}
