import {api} from "@/api";
import {FlatButton, SizedBox} from "@/components";
import {keys} from "@/constants";
import {useProfile} from "@/features/Member/hooks";
import {toDateString} from "@/utils/formatter";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function AdminStatisticsPage() {
  const navigate = useNavigate();

  const {profile} = useProfile();
  const {data: newUsersStatistics} = useQuery(
    [keys.GET_NEW_USERS_STATISTICS],
    () => api.admin.fetchNewUsersStatistics(),
    {
      enabled: !!profile,
      retry: false,
    },
  );
  const {data: newBooksStatistics} = useQuery(
    [keys.GET_NEW_BOOKS_STATISTICS],
    () => api.admin.fetchNewBooksStatistics(),
    {
      enabled: !!profile,
      retry: false,
    },
  );

  const onNavigateToHome = () => navigate("/");
  const onGoBack = () => navigate(-1);

  useEffect(() => {
    // if (profile && profile.role !== "ROLE_ADMIN") {
    //   alert("관리자만 사용할 수 있는 기능이에요!");
    //   navigate("/", {replace: true});
    // }
  }, [profile]);

  if (!newUsersStatistics || !newBooksStatistics) return null;

  return (
    <div className="mobile-view h-full overflow-hidden flex items-stretch z-[2000]">
      <div className="w-full h-full p-6 flex flex-col justify-center items-center">
        <h2 className="self-start font-bold text-[22px]">신규 가입자 통계</h2>
        <SizedBox height={8} />
        <div className="self-stretch flex flex-col border-2 border-[#242424]">
          <div className="self-stretch flex flex-row justify-between px-4 py-1 border-b border-[#888]">
            <span className="flex-1 text-center font-bold">날짜</span>
            <span className="flex-1 text-center font-bold">신규 가입자 수</span>
          </div>
          {newUsersStatistics.map(({day, count}) => (
            <div
              key={day}
              className="self-stretch flex flex-row justify-between px-4 py-1 border-b border-[#888]">
              <span className="flex-1 text-center">{toDateString(new Date(day))}</span>
              <span className="flex-1 text-center">{count}명</span>
            </div>
          ))}
        </div>

        <SizedBox height={16} />

        <h2 className="self-start font-bold text-[22px]">신규 작품 통계</h2>
        <SizedBox height={8} />
        <div className="self-stretch flex flex-col border-2 border-[#242424]">
          <div className="self-stretch flex flex-row justify-between px-4 py-1 border-b border-[#888]">
            <span className="flex-1 text-center font-bold">날짜</span>
            <span className="flex-1 text-center font-bold">신규 작품 수</span>
          </div>
          {newBooksStatistics.map(({day, count}) => (
            <div
              key={day}
              className="self-stretch flex flex-row justify-between px-4 py-1 border-b border-[#888]">
              <span className="flex-1 text-center">{toDateString(new Date(day))}</span>
              <span className="flex-1 text-center">{count}개</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-row gap-2 w-[280px]">
          <FlatButton className="h-10 !bg-[#D9D9D9] !text-[#242424]" onClick={onGoBack}>
            뒤로가기
          </FlatButton>
          <FlatButton className="h-10" onClick={onNavigateToHome}>
            홈으로 가기
          </FlatButton>
        </div>
      </div>
    </div>
  );
}
