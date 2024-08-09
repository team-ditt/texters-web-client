import {useMyBookInfo} from "@/features/FlowChart/hooks";
import useDashboardStore from "@/stores/useDashboardStore";
import useFlowChartListStore from "@/stores/useFlowChartListStore";
import {FlowChart} from "@/types/book";
import {ChangeEvent, useEffect, useState} from "react";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  bookId?: number;
  onConfirm?: () => void;
};

const isValidFlowChart = (obj: {[key: string]: string}) => {
  if (!obj) return false;
  if (typeof obj?.title !== "string") return false;
  if (typeof obj?.description !== "string") return false;
  if (!obj?.lanes) return false;
  if (!Array.isArray(obj.lanes)) return false;
  return true;
};

export default function LoadBookDialog({
  bookId,
  onConfirm = () => {},
  onRequestClose,
  ...props
}: Props) {
  const {book} = useMyBookInfo(bookId ?? Number.POSITIVE_INFINITY);
  const [content, setContent] = useState("");
  const {saveBook} = useDashboardStore();

  useEffect(() => {
    if (book) {
      const flowchart = JSON.parse(JSON.stringify(useFlowChartListStore().getFlowChart(bookId!)));
      delete flowchart.sourceUrl;
      const flowchartJSON = JSON.stringify(flowchart, null, 2);
      setContent(flowchartJSON);
    }
  }, [book]);

  const onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const onSaveBook = (ev: React.MouseEvent | React.KeyboardEvent) => {
    try {
      const jsonObject = JSON.parse(content);
      if (!isValidFlowChart(jsonObject)) throw new Error();
      saveBook(
        {
          id: book?.id ?? 0,
          title: jsonObject.title,
          description: jsonObject.description,
        },
        {...jsonObject} as FlowChart,
      );
      setContent("");
      requestClose(ev);
    } catch {
      alert("유효하지 않은 데이터입니다!");
      return;
    }
  };

  const requestClose = (ev: React.MouseEvent | React.KeyboardEvent) => {
    onRequestClose?.(ev);
  };

  // const saveAsFile = () => {
  // if (!book) return;
  // let element = document.createElement("a");
  // let text = flowchartJSON;
  // element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  // element.setAttribute("download", `${book.title}.txt`);
  // element.style.display = "none"; //하이퍼링크 요소가 보이지 않도록 처리
  // document.body.appendChild(element); //DOM body요소에 하이퍼링크 부착
  // element.click(); //클릭 이벤트 트리거 - 이 시점에 다운로드 발생
  // document.body.removeChild(element); //하이퍼링크 제거
  // };

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-0 right-0 mx-2 min-[480px]:mx-auto my-auto min-[480px]:w-[450px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-stretch overflow-hidden"
      closeTimeoutMS={200}
      appElement={document.getElementById("root") as HTMLElement}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      {...props}>
      <div className="px-5 py-2 overflow-y-auto flex flex-col gap-1 border-b border-[#242424]">
        <h1 className="font-bold text-[22px]">작품 불러오기</h1>
      </div>

      <div className="px-5 py-2">
        <textarea
          className="w-full h-32 text-sm"
          value={content ?? ""}
          onInput={onInputContent}
          placeholder="JSON 텍스트를 붙여넣어 주세요."
        />
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black">
        <button
          className="w-full h-full bg-white text-[#171717] disabled:text-[#888888]"
          onClick={requestClose}>
          취소
        </button>
        <button
          className="w-full h-full bg-[#242424] text-[#FFF] disabled:text-[#888888]"
          onClick={onSaveBook}>
          저장{book ? " (덮어쓰기)" : ""}
        </button>
      </div>
    </ReactModal>
  );
}
