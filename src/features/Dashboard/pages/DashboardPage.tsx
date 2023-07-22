import {api} from "@/api";
import {DesktopAppBar, FlatButton, SizedBox} from "@/components";
import {keys} from "@/constants";
import {DashboardBookList} from "@/features/Dashboard/components";
import {useAuthGuard, useMobileViewGuard} from "@/hooks";
import {useAuthStore} from "@/stores";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

export default function DashboardPage() {
  const didSignIn = useAuthStore(state => !!state.accessToken);
  const {data: profile} = useQuery([keys.GET_MY_PROFILE_QUERY], api.members.fetchProfile, {
    enabled: didSignIn,
  });
  const navigate = useNavigate();

  const onCreateBook = () => navigate("/studio/books/info");

  useAuthGuard();
  useMobileViewGuard(didSignIn);

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content p-6">
        <div className="flex flex-row justify-between items-center">
          <span className="text-[28px] font-bold">{profile?.penName ?? "작가"}님의 작품들</span>
          <FlatButton className="w-fit px-[20px]" onClick={onCreateBook}>
            새 작품 만들기 +
          </FlatButton>
        </div>
        <div className="mt-4 self-stretch border-t-2 border-[#2D3648]" />
        <SizedBox height={24} />
        {profile ? <DashboardBookList memberId={profile.id} /> : null}
      </div>
    </div>
  );
}
