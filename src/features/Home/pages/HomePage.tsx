import {api} from "@/api";
import {keys} from "@/constants";
import {useSignOut} from "@/features/Auth/hooks";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";

export default function HomePage() {
  const {accessToken} = useAuthStore();
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: !!accessToken,
  });
  const {mutate: signOut} = useSignOut();

  return <div className="mobile-view">홈화면 캐러셀</div>;
}
