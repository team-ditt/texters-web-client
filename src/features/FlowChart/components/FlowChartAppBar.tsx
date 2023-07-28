import {Modal} from "@/components";
import AutoSaveMarker from "@/components/AutoSaveMarker";
import {useMyBookInfo} from "@/features/FlowChart/hooks";
import {useFlowChartStore} from "@/stores";
import {TextersErrorCode} from "@/types/error";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function FlowChartAppBar() {
  const {bookId} = useParams();
  const navigate = useNavigate();
  const {
    flowChart,
    isSaving,
    updatedAt,
    error: flowChartError,
    loadFlowChart,
  } = useFlowChartStore();
  const {book, NotAuthorAlert, PublishedBookAlert} = useMyBookInfo(+bookId!);
  const isLockedFlowChart = flowChartError?.code === TextersErrorCode.LOCKED_FLOW_CHART;

  const onGoBack = () => navigate(-1);
  const onRefresh = () => {
    window.location.reload();
  };
  const onGoHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    if (!flowChart && book?.status !== "PUBLISHED") loadFlowChart(+bookId!);
  }, [flowChart, book]);

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
          미리 읽어보기
        </button>
      </div>
      <NotAuthorAlert />
      <PublishedBookAlert />
      <Modal.Dialog
        isOpen={isLockedFlowChart}
        title="잠깐, 여러 창을 띄워 두고 작업 중이신가요?"
        message="텍스터즈는 작품 동시 수정을 지원하고 있지 않아요. 새로고침하시겠어요?"
        confirmMessage="새로고침하기"
        onConfirm={onRefresh}
        cancelMessage="홈으로 가기"
        onCancel={onGoHome}
      />
    </nav>
  );
}
