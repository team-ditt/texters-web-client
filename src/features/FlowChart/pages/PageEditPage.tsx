import {api} from "@/api";
import {Modal, SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {FlowChartAppBar} from "@/features/FlowChart/components";
import {
  useChoiceContentInput,
  useDestinationPages,
  usePageContentTextArea,
  usePageTitleInput,
} from "@/features/FlowChart/hooks";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useAuthGuard, useMobileViewGuard, useModal} from "@/hooks";
import {useFlowChartStore} from "@/stores";
import {Choice} from "@/types/book";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as DownArrowCircleIcon} from "assets/icons/down-arrow-circle.svg";
import {ReactComponent as DragHandleIcon} from "assets/icons/drag-handle.svg";
import {ReactComponent as PlusCircleIcon} from "assets/icons/plus-circle.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import classNames from "classnames";
import {AnimatePresence, motion} from "framer-motion";
import {FormEventHandler, MouseEvent, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";

export default function PageEditPage() {
  const didSignIn = useDidSignIn();
  const {bookId, pageId} = useParams();
  const {title, setTitle, onInputTitle} = usePageTitleInput(+bookId!, +pageId!);
  const {content, setContent, onInputContent} = usePageContentTextArea(+bookId!, +pageId!);

  const {data: page} = useQuery(
    [keys.GET_FLOW_CHART_PAGE, pageId],
    () => api.pages.fetchPage(+bookId!, +pageId!),
    {enabled: didSignIn, refetchOnWindowFocus: false, retry: false},
  );

  const {RequestSignInDialog} = useAuthGuard();
  const {MobileViewAlert} = useMobileViewGuard();
  useEffect(() => {
    if (!page) return;
    setTitle(page.title);
    setContent(page.content ?? "");
  }, [page]);
  useEffect(() => {
    document.body.style.backgroundColor = "#EFEFEF";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  if (!page)
    return (
      <div className="flow-chart-view bg-[#EFEFEF]">
        <FlowChartAppBar />
        <AnimatePresence mode="wait">
          <motion.div
            className="absolute inset-0 m-auto w-full h-full bg-white flex justify-center items-center"
            initial={{opacity: 0}}
            animate={{opacity: 0.5}}
            exit={{opacity: 0}}>
            <SpinningLoader color="#BDBDBD" />
          </motion.div>
        </AnimatePresence>

        <MobileViewAlert />
        <RequestSignInDialog />
      </div>
    );

  return (
    <div className="flow-chart-view bg-[#EFEFEF]">
      <FlowChartAppBar />
      <div className="flow-chart-view-content max-w-[1280px] bg-white m-4 px-6 py-4 relative flex flex-col items-stretch">
        <div className="flex flex-col items-stretch border-t-[3px] border-black">
          <input
            className="h-[50px] px-6 font-medium text-[18px] placeholder:text-[#BDBDBD]"
            value={title}
            placeholder="페이지 제목"
            maxLength={30}
            onInput={onInputTitle}
          />
          <div className="flex-1 border-b-[3px] border-b-black flex flex-col">
            <textarea
              className="min-h-[600px] flex-1 border-y-2 border-[#BDBDBD] placeholder:text-[#BDBDBD] resize-none leading-7 px-6 py-3"
              placeholder="페이지 본문"
              value={content ?? undefined}
              onInput={onInputContent as FormEventHandler}
              maxLength={20000}
            />
            <p className="flex self-end items-center px-6 py-3">
              <span className="font-bold text-[14px] me-1">{content?.length.toLocaleString()}</span>
              <span className="font-bold text-[14px] text-[#D1D1D1]">/ 20,000자</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <span className="font-bold text-[18px] mb-2">선택지 만들기</span>
          {page.choices.map(choice => (
            <ChoiceForm key={choice.id} choice={choice} />
          ))}
          {page.choices.length < 5 ? <AddChoiceButton /> : null}
        </div>
      </div>

      <MobileViewAlert />
      <RequestSignInDialog />
    </div>
  );
}

function ChoiceForm({choice}: {choice: Choice}) {
  const {bookId, pageId} = useParams();
  const {content, onInputContent} = useChoiceContentInput(+bookId!, +pageId!, choice);
  const {isOpen, openModal, closeModal} = useModal();

  const {deleteChoice} = useFlowChartStore();
  const queryClient = useQueryClient();
  const onSuccessToDelete = () => queryClient.invalidateQueries([keys.GET_FLOW_CHART_PAGE], {});

  const onConfirm = async () => {
    await deleteChoice(
      {bookId: +bookId!, pageId: +pageId!, choiceId: choice.id},
      onSuccessToDelete,
    );
    closeModal();
  };

  return (
    <div className="h-12 flex gap-1">
      <button
        className="h-12 px-1 rounded-lg hover:bg-[#EFEFEF] transition-colors flex justify-center items-center gap-1 text-[#BBB]"
        onClick={openModal}>
        <TrashIcon width={28} height={28} stroke="#CBD2E0" />
      </button>
      <DragHandleIcon className="self-center" />
      <SizedBox width={4} />
      <input
        className="flex-1 px-4 border-2 border-black rounded-lg"
        placeholder="선택지를 추가해주세요! (최대 100자)"
        value={content}
        onInput={onInputContent}
        maxLength={100}
      />
      <DestinationPageSelect choice={choice} />

      <Modal.Dialog
        isOpen={isOpen}
        title="선택지 삭제"
        message="정말로 선택지를 삭제하시겠어요?"
        confirmMessage="삭제하기"
        onConfirm={onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
}

function DestinationPageSelect({choice}: {choice: Choice}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const {isOpen, openModal, closeModal} = useModal();
  const {bookId, pageId} = useParams();
  const {allPossibleDestinationPages} = useDestinationPages(+pageId!, choice.id);
  const {updateChoiceDestinationPageId} = useFlowChartStore();
  const loadChoiceDestination = useFlowChartEditorStore(state => state.loadChoiceDestination);

  const queryClient = useQueryClient();
  const onUpdateDestinationPageId = async (id: number | null) => {
    await updateChoiceDestinationPageId({
      bookId: +bookId!,
      pageId: +pageId!,
      choiceId: choice.id,
      destinationPageId: id,
    });
    loadChoiceDestination(choice.id, id);
    queryClient.invalidateQueries([keys.GET_FLOW_CHART_PAGE]);
    closeModal();
  };
  const getPageTitle = (pageId: number | null) => {
    if (!pageId) return "";
    return allPossibleDestinationPages.find(page => page.id === pageId)?.title;
  };
  const isSelected = (pageId: number) => choice.destinationPageId === pageId;
  const onCloseModal = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    closeModal();
  };

  useEffect(() => {
    if (!buttonRef.current) return;
    setOffset(buttonRef.current.getBoundingClientRect());
  }, [buttonRef]);

  return (
    <button
      ref={buttonRef}
      className="relative flex justify-between items-center w-[300px] px-4 bg-[#D1D1D1] border-2 border-black rounded-lg"
      onClick={openModal}>
      {choice.destinationPageId ? getPageTitle(choice.destinationPageId) : "연결된 페이지 없음"}
      <DownArrowCircleIcon
        className={classNames({"rotate-180": isOpen})}
        fill={isOpen ? "#A5A5A5" : "#2D2D2D"}
      />
      {isOpen ? (
        <>
          <div
            className="fixed inset-0 w-full h-full bg-transparent z-[12000] cursor-default"
            onClick={onCloseModal}
          />
          <ul className="absolute top-12 left-0 w-[298px] max-h-[212px] border-2 border-[#D9D9D9] flex flex-col items-stretch bg-white overflow-auto z-[12000]">
            <li
              className="min-h-[52px] flex items-center px-6 text-[#FF0000] hover:bg-[#F9F9F9] cursor-pointer"
              onClick={() => onUpdateDestinationPageId(null)}>
              페이지 연결 해제
            </li>
            {allPossibleDestinationPages.map(page => (
              <li
                key={page.id}
                className={classNames(
                  "min-h-[52px] flex items-center px-6 border-t-2 border-[#D9D9D9] cursor-pointer",
                  {
                    "bg-[#EFEFEF]": isSelected(page.id),
                    "text-[#888888] hover:bg-[#F9F9F9]": !isSelected(page.id),
                  },
                )}
                onClick={() => onUpdateDestinationPageId(page.id)}>
                {page.title}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </button>
  );
}

function AddChoiceButton() {
  const {bookId, pageId} = useParams();
  const {isSaving, createChoice} = useFlowChartStore();

  const queryClient = useQueryClient();
  const onClick = async () => {
    const DEFAULT_CONTENT = "다음";
    await createChoice({bookId: +bookId!, pageId: +pageId!, content: DEFAULT_CONTENT});
    queryClient.invalidateQueries([keys.GET_FLOW_CHART_PAGE]);
  };

  return (
    <button
      className="self-center flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#EFEFEF] transition-colors font-medium text-[#858585]"
      onClick={onClick}
      disabled={isSaving}>
      <PlusCircleIcon /> 선택지 추가하기
    </button>
  );
}
