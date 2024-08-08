import {api} from "@/api";
import {Modal, SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {useDidSignIn} from "@/features/Auth/hooks";
import {ChoiceDestinationPageSelect, FlowChartAppBar} from "@/features/FlowChart/components";
import {
  useChoiceContentInput,
  usePageContentTextArea,
  usePageTitleInput,
} from "@/features/FlowChart/hooks";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useProfile} from "@/features/Member/hooks";
import {useAuthGuard, useMobileViewGuard, useModal} from "@/hooks";
import {useFlowChartStore} from "@/stores";
import useFlowChartListStore from "@/stores/useFlowChartListStore";
import {Choice, Page} from "@/types/book";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ReactComponent as DragHandleIcon} from "assets/icons/drag-handle.svg";
import {ReactComponent as PlusCircleIcon} from "assets/icons/plus-circle.svg";
import {ReactComponent as TrashIcon} from "assets/icons/trash.svg";
import {AnimatePresence, motion} from "framer-motion";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";

export default function PageEditPage() {
  const didSignIn = useDidSignIn();
  const {profile} = useProfile();
  const {bookId, pageId} = useParams();
  const {title, setTitle, onInputTitle} = usePageTitleInput(+bookId!, +pageId!);

  // const {data: page} = useQuery(
  //   [keys.GET_DASHBOARD_PAGE, pageId],
  //   () => api.pages.fetchDashboardPage(profile!.id, +bookId!, +pageId!),
  //   {enabled: !!profile && didSignIn, refetchOnWindowFocus: false, retry: false},
  // );
  const flowChart = useFlowChartListStore().getFlowChart(+bookId!);
  const page = flowChart.lanes.flatMap(lane => lane.pages).find(page => page.id === +pageId!);
  const {content, setContent, onInputContent} = usePageContentTextArea(+bookId!, +pageId!);

  const _onInputTitle = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > 30) return;
    onInputTitle(event);
  };
  const _onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value.length > 20000) return;
    onInputContent(event);
  };

  const {RequestSignInDialog} = useAuthGuard();
  const {MobileViewAlert} = useMobileViewGuard();
  useEffect(() => {
    document.body.style.backgroundColor = "#EFEFEF";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);
  useEffect(() => {
    if (!page) return;
    setTitle(page.title);
    setContent(page.content ?? "");
  }, [page]);

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
            value={title ?? ""}
            placeholder="페이지 제목"
            maxLength={30}
            onInput={_onInputTitle}
          />
          <div className="flex-1 border-b-[3px] border-b-black flex flex-col">
            <textarea
              className="min-h-[600px] flex-1 border-y-2 border-[#BDBDBD] placeholder:text-[#BDBDBD] resize-none leading-7 px-6 py-3"
              placeholder="페이지 본문"
              value={content ?? ""}
              onInput={_onInputContent}
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
          <ChoiceList page={page} />
          {/* {page.choices.length < 5 ? <AddChoiceButton /> : null} */}
        </div>
      </div>

      <MobileViewAlert />
      <RequestSignInDialog />
    </div>
  );
}

function ChoiceList({page}: {page: Page}) {
  const {bookId, pageId} = useParams();
  // const {updateChoiceOrder} = useFlowChartStore();
  const loadChoiceOrder = useFlowChartEditorStore(state => state.loadChoiceOrder);
  const queryClient = useQueryClient();
  const [choiceDraggingState, setChoiceDraggingState] = useState({
    choiceId: -1,
    relativeOrder: 0,
  });

  const handleChoiceDrag = (choiceId: number, relativeOrder: number) => {
    // setChoiceDraggingState({choiceId, relativeOrder});
  };
  const handleChoiceDragEnd = async (choiceId: number, relativeOrder: number) => {
    // let newOrder = page.choices.find(c => c.id === choiceId)?.order;
    // if (newOrder === undefined) {
    //   setChoiceDraggingState({choiceId: -1, relativeOrder: 0});
    //   return;
    // }
    // newOrder += relativeOrder;
    // newOrder = Math.max(0, Math.min(newOrder, page.choices.length - 1));
    // await updateChoiceOrder({
    //   bookId: +bookId!,
    //   pageId: +pageId!,
    //   choiceId,
    //   order: newOrder,
    // });
    // loadChoiceOrder(choiceId, newOrder);
    // queryClient.invalidateQueries([keys.GET_DASHBOARD_INTRO_PAGE]);
    // queryClient.invalidateQueries([keys.GET_DASHBOARD_PAGE]);
    // setChoiceDraggingState({choiceId: -1, relativeOrder: 0});
  };

  const choices = page.choices;
  const shuffledChoices = choices.filter(c => c.id !== choiceDraggingState.choiceId);
  if (choiceDraggingState.choiceId !== -1) {
    const choice = choices.find(c => c.id === choiceDraggingState.choiceId)!;
    let newOrder = choice.order + choiceDraggingState.relativeOrder;
    newOrder = Math.max(0, Math.min(newOrder, choices.length - 1));
    shuffledChoices.splice(newOrder, 0, choice);
  }
  const orderedShuffledChoices = shuffledChoices.map(c => ({
    ...c,
    relativeOrder:
      shuffledChoices.findIndex(d => d.id === c.id) - choices.findIndex(d => d.id === c.id),
  }));

  return (
    <>
      {orderedShuffledChoices
        .sort((a, b) => a.order - b.order)
        .map(choice => (
          <ChoiceForm
            key={choice.id}
            choice={choice}
            relativeOrder={choice.relativeOrder}
            onDrag={handleChoiceDrag}
            onDragEnd={handleChoiceDragEnd}
          />
        ))}
    </>
  );
}

function ChoiceForm({
  choice,
  relativeOrder,
  onDrag,
  onDragEnd,
}: {
  choice: Choice;
  relativeOrder: number;
  onDrag: (choiceId: number, relativeOrder: number) => void;
  onDragEnd: (choiceId: number, relativeOrder: number) => void;
}) {
  const {bookId, pageId} = useParams();
  const {content, onInputContent} = useChoiceContentInput(+bookId!, +pageId!, choice);
  const {isOpen, openModal, closeModal} = useModal();

  // const {deleteChoice} = useFlowChartStore();
  const queryClient = useQueryClient();
  const onSuccessToDelete = async () => {
    queryClient.invalidateQueries([keys.GET_DASHBOARD_INTRO_PAGE]);
    queryClient.invalidateQueries([keys.GET_DASHBOARD_PAGE]);
  };

  const _onInputContent = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.length > 100) return;
    onInputContent(event);
  };
  const onConfirm = async () => {
    // await deleteChoice(
    //   {bookId: +bookId!, pageId: +pageId!, choiceId: choice.id},
    //   onSuccessToDelete,
    // );
    useFlowChartEditorStore.getState().unloadChoice(choice.id);
    closeModal();
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingState, setDraggingState] = useState({isDragging: false, offsetY: 0});
  const offsetYRef = useRef(0);
  const [orderChanged, setOrderChanged] = useState(false);

  const calcHeightWithGap = () => {
    const containerElement = containerRef.current;
    if (containerElement) {
      const {height} = containerElement.getBoundingClientRect();
      const gap = Number.parseInt(
        containerElement.parentElement
          ?.computedStyleMap()
          .get("gap")
          ?.toString()
          .replace("px", "") ?? "0",
      );
      return height + gap;
    }
    return 0;
  };
  const calcRelativeOrder = () => Math.floor(offsetYRef.current / calcHeightWithGap() + 0.5);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (containerElement && draggingState.isDragging) {
      const onMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        offsetYRef.current += event.movementY;
        const relativeOrder = calcRelativeOrder();
        onDrag(choice.id, relativeOrder);
        setDraggingState(state => ({...state, offsetY: offsetYRef.current}));
      };
      const finishDrag = () => {
        const relativeOrder = calcRelativeOrder();
        onDragEnd(choice.id, relativeOrder);
        setDraggingState({isDragging: false, offsetY: 0});
        offsetYRef.current = 0;
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", finishDrag);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", finishDrag);
      };
    }
  }, [draggingState.isDragging]);
  useEffect(() => {
    setOrderChanged(true);
  }, [choice.order]);
  useEffect(() => {
    if (orderChanged) setOrderChanged(false);
  }, [orderChanged]);

  return (
    <div
      className={`h-12 flex gap-1 ${
        draggingState.isDragging ? "z-10" : orderChanged ? "" : "transition-all"
      }`}
      style={{
        transform: draggingState.isDragging
          ? `translateY(${draggingState.offsetY}px) scale(1.01)`
          : `translateY(${calcHeightWithGap() * relativeOrder}px)`,
      }}
      ref={containerRef}>
      {/* <button
        className="h-12 px-1 rounded-lg hover:bg-[#EFEFEF] transition-colors flex justify-center items-center gap-1 text-[#BBB]"
        onClick={openModal}>
        <TrashIcon width={28} height={28} stroke="#CBD2E0" />
      </button> */}
      {/* <button onMouseDown={() => setDraggingState(state => ({...state, isDragging: true}))}>
        <DragHandleIcon className="self-center" />
      </button> */}
      <SizedBox width={4} />
      <input
        className="flex-1 px-4 border-2 border-black rounded-lg"
        placeholder="선택지를 추가해주세요! (최대 100자)"
        value={content}
        onInput={_onInputContent}
        maxLength={100}
      />
      <ChoiceDestinationPageSelect bookId={+bookId!} pageId={+pageId!} choice={choice} />

      {/* <Modal.Dialog
        isOpen={isOpen}
        title="선택지 삭제"
        message="정말로 선택지를 삭제하시겠어요?"
        confirmMessage="삭제하기"
        onConfirm={onConfirm}
        onCancel={closeModal}
      /> */}
    </div>
  );
}

function AddChoiceButton() {
  const {bookId, pageId} = useParams();
  // const {isSaving, createChoice} = useFlowChartStore();

  const queryClient = useQueryClient();
  const onClick = async () => {
    const DEFAULT_CONTENT = "다음";
    // const choice = await createChoice({
    //   bookId: +bookId!,
    //   pageId: +pageId!,
    //   content: DEFAULT_CONTENT,
    // });
    // useFlowChartEditorStore
    //   .getState()
    //   .loadNewChoice(choice.sourcePageId, choice.id, choice.content);
    queryClient.invalidateQueries([keys.GET_DASHBOARD_INTRO_PAGE]);
    queryClient.invalidateQueries([keys.GET_DASHBOARD_PAGE]);
  };

  return (
    <button
      className="self-center flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#EFEFEF] transition-colors font-medium text-[#858585]"
      onClick={onClick}
      disabled={false}>
      <PlusCircleIcon stroke="#A5A5A5" fill="#A5A5A5" /> 선택지 추가하기
    </button>
  );
}
