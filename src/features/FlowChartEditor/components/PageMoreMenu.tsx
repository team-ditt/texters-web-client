import {Modal} from "@/components";
import DynamicElementLocator from "@/features/FlowChartEditor/components/DynamicElementLocator";
import StaticElementLocator from "@/features/FlowChartEditor/components/StaticElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useIdProviderStore from "@/features/FlowChartEditor/stores/useIdProviderStore";
import {useModal} from "@/hooks";
import {useBookReaderStore} from "@/stores";
import {ReactComponent as EditIcon} from "assets/icons/edit.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {ReactComponent as ViewIcon} from "assets/icons/viewed.svg";
import {MouseEvent} from "react";
import {useNavigate} from "react-router-dom";

const OFFSET = {
  x: 388,
  y: 72,
};

export default function PageMoreMenu() {
  const {recordHistory} = useBookReaderStore();
  const isEditable = useFlowChartEditorStore(state => state.isEditable());
  const bookId = useFlowChartEditorStore(state => state.bookId);
  const openedMoreMenuPageId = useFlowChartEditorStore(state => state.openedMoreMenuPageId);
  const pageViewState = useFlowChartEditorStore(
    state => state.viewStates.pages[openedMoreMenuPageId ?? 0],
  );
  const lanes = useFlowChartEditorStore(state => state.viewStates.lanes);
  const deletePage = useFlowChartEditorStore(state => state.deletePage);
  const closePageMoreMenu = useFlowChartEditorStore(state => state.closePageMoreMenu);
  const navigate = useNavigate();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  if (openedMoreMenuPageId === null || !pageViewState) return;

  const page = pageViewState.data;
  const elementState = pageViewState.elementState;
  if (!elementState) return;

  const lane = lanes[page.laneId].data;
  const isIntro = lane?.order === 0;
  const currentPosition = elementState.box;

  const onReadFromThePage = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const realId = useIdProviderStore.getState().getRealId(page.id)!;
    closePageMoreMenu();
    recordHistory(bookId!.toString(), {pageId: realId, isEnding: false});
    navigate(`/studio/books/${bookId}/read`);
  };
  const onPageEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const realId = useIdProviderStore.getState().getRealId(page.id);
    closePageMoreMenu();
    navigate(`/studio/books/${bookId}/flow-chart/pages/${realId}`);
  };
  const onPageDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openDeleteModal();
  };
  const onConfirm = () => {
    deletePage(page.id);
    closeDeleteModal();
    closePageMoreMenu();
  };

  return (
    <>
      <StaticElementLocator zIndex={9999}>
        <div
          className="absolute top-0 left-0 w-[10000px] h-[10000px]"
          onClick={closePageMoreMenu}></div>
      </StaticElementLocator>
      <DynamicElementLocator zIndex={99999}>
        <div
          className="absolute cursor-pointer z-1000 right-0 top-0"
          style={{
            transform: `translate(${currentPosition.x + OFFSET.x}px, ${
              currentPosition.y + OFFSET.y
            }px)`,
          }}>
          <div className="absolute top-0 left-[26px] w-[220px] flex flex-col border-[2px] border-[#C1C1C1] rounded-[8px] bg-white text-[#6F6F6F] text-[14px] font-bold overflow-hidden z-[3000]">
            <button
              className="px-4 py-2 flex justify-between items-center"
              onClick={onReadFromThePage}>
              이 페이지부터 읽어보기
              <ViewIcon
                stroke="#6F6F6F"
                fill="transparent"
                width="20"
                height="20"
                strokeWidth={1.3}
              />
            </button>
            {isEditable && (
              <button
                className="px-4 py-2 border-t border-[#AFAFAF] flex justify-between items-center"
                onClick={onPageEdit}>
                페이지 작성으로 이동
                <EditIcon stroke="#6F6F6F" fill="#6F6F6F" strokeWidth={0.5} />
              </button>
            )}
            {!isIntro && isEditable && (
              <button
                className="px-4 py-2 border-t translate-x-[1px] border-[#AFAFAF] flex justify-between items-center text-[#FF0000]"
                onClick={onPageDelete}>
                페이지 삭제하기
                <TrashIcon stroke="#FF0000" />
              </button>
            )}
          </div>
        </div>
      </DynamicElementLocator>
      <Modal.Dialog
        isOpen={isDeleteOpen}
        title="페이지 삭제"
        message="페이지를 삭제하면 내용과 선택지가 모두 삭제되어요... 진짜 삭제하시겠어요?"
        confirmMessage="삭제하기"
        onConfirm={onConfirm}
        onCancel={closeDeleteModal}
      />
    </>
  );
}
