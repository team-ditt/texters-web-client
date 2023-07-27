import {api} from "@/api";
import {FlowChartAppBar, SizedBox, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {usePageContentTextArea, usePageTitleInput} from "@/features/FlowChart/hooks";
import {useAuthGuard} from "@/hooks";
import {useQuery} from "@tanstack/react-query";
import {ReactComponent as DragHandleIcon} from "assets/icons/drag-handle.svg";
import {ReactComponent as PlusCircleIcon} from "assets/icons/plus-circle.svg";
import {AnimatePresence, motion} from "framer-motion";
import {FormEventHandler, useEffect} from "react";
import {useParams} from "react-router-dom";

export default function PageEditPage() {
  const {bookId, pageId} = useParams();
  const {title, setTitle, onInputTitle} = usePageTitleInput(+bookId!, +pageId!);
  const {content, setContent, onInputContent} = usePageContentTextArea(+bookId!, +pageId!);

  const {data: page} = useQuery([keys.GET_FLOW_CHART_PAGE, pageId], () =>
    api.pages.fetchPage(+bookId!, +pageId!),
  );

  useAuthGuard();
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
            <ChoiceForm key={choice.id} />
          ))}
          {page.choices.length < 5 ? <AddChoiceButton /> : null}
        </div>
      </div>
    </div>
  );
}

function ChoiceForm() {
  return (
    <div className="h-12 flex gap-1">
      <DragHandleIcon className="self-center" />
      <SizedBox width={4} />
      <input
        className="flex-1 px-4 border-2 border-black rounded-lg"
        placeholder="선택지를 추가해주세요! (최대 100자)"
        maxLength={100}
      />
      <div className="flex items-center w-[300px] px-4 bg-[#D1D1D1] border-2 border-black rounded-lg">
        연결 페이지
      </div>
    </div>
  );
}

function AddChoiceButton() {
  return (
    <button className="self-center flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#EFEFEF] transition-colors font-medium text-[#858585]">
      <PlusCircleIcon /> 선택지 추가하기
    </button>
  );
}
