import {Modal, SizedBox} from "@/components";
import AutoSaveMarker from "@/components/AutoSaveMarker";
import {keys} from "@/constants";
import {useMyBookInfo} from "@/features/FlowChart/hooks";
import useFlowChartEditor from "@/features/FlowChartEditor/hooks/useFlowChartEditor";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useBookReaderStore, useFlowChartStore} from "@/stores";
import {TextersErrorCode} from "@/types/error";
import {useQueryClient} from "@tanstack/react-query";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function FlowChartAppBar() {
  const {bookId, pageId} = useParams();
  const navigate = useNavigate();
  const {recordHistory, resetHistory} = useBookReaderStore();
  const {
    flowChart,
    isSaving,
    updatedAt,
    error: flowChartError,
    loadFlowChart,
  } = useFlowChartStore();
  const {book, NotAuthorAlert} = useMyBookInfo(+bookId!);
  const isLockedFlowChart = flowChartError?.code === TextersErrorCode.LOCKED_FLOW_CHART;
  const isFailedToAutoSave = Boolean(
    flowChartError && flowChartError.code !== TextersErrorCode.LOCKED_FLOW_CHART,
  );

  const onGoBack = () => navigate(-1);
  const onRefresh = () => {
    window.location.reload();
  };
  const onGoHome = () => {
    window.location.href = "/";
  };
  const onDemoRead = () => {
    resetHistory(bookId!);
    navigate(`/studio/books/${bookId}/read`);
  };
  const onDemoReadFromThisPage = () => {
    resetHistory(bookId!);
    recordHistory(bookId!, {pageId: +pageId!, isEnding: false});
    navigate(`/studio/books/${bookId}/read`);
  };

  useFlowChartEditor();
  useEffect(() => {
    if (!flowChart) loadFlowChart(+bookId!);
  }, [flowChart, book]);

  const actionQueue = useFlowChartEditorStore(state => state.actionQueue);
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries([keys.GET_DASHBOARD_INTRO_PAGE]);
    queryClient.invalidateQueries([keys.GET_DASHBOARD_PAGE]);
  }, [actionQueue.length]);

  return (
    <nav className="fixed inset-0 mx-auto my-0 min-w-[800px] h-14 ps-6 pe-4 bg-white flex justify-between items-center z-[1000] drop-shadow-sm">
      <div className="flex items-center gap-2">
        <button onClick={onGoBack}>
          <LeftArrowIcon fill="#939393" />
        </button>
        <h1 className="font-bold text-ellipsis line-clamp-1">{book?.title}</h1>
      </div>
      <div className="flex items-center gap-1">
        <AutoSaveMarker isSaving={isSaving} updatedAt={updatedAt} error={flowChartError} />
        <SizedBox width={12} />
        <button
          className="max-h-10 border-2 border-[#242424] rounded-full px-4 py-1.5 font-bold text-ellipsis whitespace-nowrap"
          onClick={onDemoRead}>
          처음부터 미리 읽어보기
        </button>
        {pageId ? (
          <button
            className="max-h-10 border-2 border-[#242424] rounded-full px-4 py-1.5 font-bold text-ellipsis whitespace-nowrap"
            onClick={onDemoReadFromThisPage}>
            이 페이지부터 미리 읽어보기
          </button>
        ) : null}
      </div>

      <NotAuthorAlert />
      <Modal.Dialog
        isOpen={isLockedFlowChart}
        title="잠깐, 여러 창을 띄워 두고 작업 중이신가요?"
        message="텍스터즈는 작품 동시 수정을 지원하고 있지 않아요. 새로고침하시겠어요?"
        confirmMessage="새로고침하기"
        onConfirm={onRefresh}
        cancelMessage="홈으로 가기"
        onCancel={onGoHome}
      />
      <Modal.Dialog
        isOpen={isFailedToAutoSave}
        title="자동저장에 실패했어요!"
        message="서버와의 연결이 불안정해요... 이어서 작업하시려면 새로고침해주세요!"
        confirmMessage="새로고침하기"
        onConfirm={onRefresh}
        cancelMessage="홈으로 가기"
        onCancel={onGoHome}
      />
    </nav>
  );
}
