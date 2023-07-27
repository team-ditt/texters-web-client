import {api} from "@/api";
import AutoSaveMarker from "@/components/AutoSaveMarker";
import {keys} from "@/constants";
import {useFlowChartStore} from "@/stores";
import {TextersError, TextersErrorCode} from "@/types/error";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {AxiosError} from "axios";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function FlowChartAppBar() {
  const {bookId} = useParams();
  const navigate = useNavigate();
  const {
    isSaving,
    isLocked,
    updatedAt,
    error: flowChartError,
    resetError,
    loadFlowChart,
  } = useFlowChartStore();

  const {data: profile} = useQuery([keys.GET_MY_PROFILE], api.members.fetchProfile);
  const {
    data: book,
    error,
    isError,
  } = useQuery([keys.GET_MY_BOOK, bookId], () => api.books.fetchMyBook(profile!.id, +bookId!), {
    enabled: !!profile?.id,
    retry: false,
  });

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    if (!isError) return;
    if (
      (error as AxiosError<TextersError>).response?.data.code ===
      TextersErrorCode.INVALID_AUTH_TOKEN
    )
      return;
    alert((error as AxiosError<TextersError>).response?.data.message);
    navigate("/studio/dashboard", {replace: true});
  }, [isError, error]);

  useEffect(() => {
    if (!flowChartError || isLocked) return;
    resetError();
    loadFlowChart(+bookId!);
  }, [flowChartError, isLocked]);

  return (
    <nav className="fixed inset-0 mx-auto my-0 h-14 ps-6 pe-4 bg-white flex justify-between items-center z-[1000]">
      <div className="flex items-center gap-2">
        <button onClick={onGoBack}>
          <LeftArrowIcon fill="#939393" />
        </button>
        <h1 className="font-bold">{book?.title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <AutoSaveMarker isSaving={isSaving} updatedAt={updatedAt} error={flowChartError} />
        {/* TODO: 미리 플레이 버튼 활성화 */}
        <button className="border-2 border-[#242424] rounded-full px-4 py-1.5 font-bold">
          미리 플레이 해보기
        </button>
      </div>
    </nav>
  );
}
