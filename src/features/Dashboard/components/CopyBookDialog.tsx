import {useMyBookInfo} from "@/features/FlowChart/hooks";
import useFlowChartListStore from "@/stores/useFlowChartListStore";
import {useEffect} from "react";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  bookId: number;
  onConfirm?: () => void;
};

export default function CopyBookDialog({
  bookId,
  onConfirm = () => {},
  onRequestClose,
  ...props
}: Props) {
  const {book} = useMyBookInfo(bookId);
  const flowchart = useFlowChartListStore().getFlowChart(bookId);
  const flowchartJSON = JSON.stringify(flowchart, null, 2);

  const copyOnClipboard = () => {
    navigator.clipboard.writeText(flowchartJSON).then(() => {
      alert("복사되었습니다!");
    });
  };

  const saveAsFile = () => {
    if (!book) return;
    let element = document.createElement("a");
    let text = flowchartJSON;
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", `${book.title}.txt`);
    element.style.display = "none"; //하이퍼링크 요소가 보이지 않도록 처리
    document.body.appendChild(element); //DOM body요소에 하이퍼링크 부착
    element.click(); //클릭 이벤트 트리거 - 이 시점에 다운로드 발생
    document.body.removeChild(element); //하이퍼링크 제거
  };

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
        <h1 className="font-bold text-[22px]">작품 내보내기</h1>
      </div>

      <div className="px-5 py-2">
        <textarea className="w-full h-32 text-sm" value={flowchartJSON} readOnly />
      </div>

      <div className="h-12 flex self-stretch border-t-[1.5px] border-black">
        <button
          className="w-full h-full bg-orange-500 text-[#FFF] disabled:text-[#888888]"
          onClick={copyOnClipboard}>
          클립보드에 복사
        </button>
        <button
          className="w-full h-full bg-blue-500 text-[#FFF]  disabled:text-[#888888]"
          onClick={saveAsFile}>
          파일로 저장
        </button>
        <button
          className="w-full h-full bg-white text-[#171717] disabled:text-[#888888]"
          onClick={onRequestClose}>
          닫기
        </button>
      </div>
    </ReactModal>
  );
}
