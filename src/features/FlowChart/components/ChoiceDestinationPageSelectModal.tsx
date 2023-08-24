import {keys} from "@/constants";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {useFlowChartStore} from "@/stores";
import {Choice} from "@/types/book";
import {useQueryClient} from "@tanstack/react-query";
import {ReactComponent as CheckIcon} from "assets/icons/check.svg";
import classNames from "classnames";
import {MouseEvent, useState} from "react";
import ReactModal from "react-modal";

type Props = ReactModal.Props & {
  bookId: number;
  pageId: number;
  choice: Choice;
  pages: {id: number; title: string}[];
};

export default function ChoiceDestinationPageSelectModal({
  bookId,
  pageId,
  choice,
  pages,
  onRequestClose,
  ...props
}: Props) {
  const [selectedPageId, setSelectedPageId] = useState<number | null>(choice.destinationPageId);
  const updateChoiceDestinationPageId = useFlowChartStore(
    state => state.updateChoiceDestinationPageId,
  );
  const loadChoiceDestination = useFlowChartEditorStore(state => state.loadChoiceDestination);
  const queryClient = useQueryClient();

  const isSelected = (pageId: number) => pageId === selectedPageId;
  const onUpdateDestinationPageId = async (event: MouseEvent) => {
    await updateChoiceDestinationPageId({
      bookId,
      pageId,
      choiceId: choice.id,
      destinationPageId: selectedPageId,
    });
    loadChoiceDestination(choice.id, selectedPageId);
    queryClient.invalidateQueries([keys.GET_DASHBOARD_INTRO_PAGE]);
    queryClient.invalidateQueries([keys.GET_DASHBOARD_PAGE]);
    onRequestClose?.call(null, event);
  };

  return (
    <ReactModal
      overlayClassName="fixed inset-0 bg-overlay z-[12000]"
      className="absolute top-14 bottom-14 left-2 right-2 m-auto max-w-[650px] h-fit max-h-[600px] border-[3px] border-black outline-none bg-white rounded-[12px] flex flex-col items-center overflow-hidden"
      closeTimeoutMS={200}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root") as HTMLElement}
      {...props}>
      <div className="w-full flex flex-col items-start gap-[6px] px-8 py-4">
        <span className="text-[1.5rem] font-bold whitespace-pre">페이지 연결하기</span>
        <span className="line-clamp-1">{choice.content}</span>
      </div>
      <div className="w-full border-t-[1.5px] border-[#242424]" />

      <ul className="w-full max-h-[260px] flex flex-col items-stretch bg-white overflow-auto z-[12000]">
        <li
          className="min-h-[52px] flex items-center gap-1 px-8 text-[#FF0000] hover:bg-[#F9F9F9] cursor-pointer"
          onClick={() => setSelectedPageId(null)}>
          <div className="w-6 h-6">{!selectedPageId ? <CheckIcon fill="#FF0000" /> : null}</div>
          <span className="line-clamp-1">페이지 연결 해제</span>
        </li>
        {pages.map(page => (
          <li
            key={page.id}
            className={classNames(
              "min-h-[52px] flex items-center gap-1 px-8 border-t-2 border-[#D9D9D9] cursor-pointer",
              {
                "bg-[#D9D9D9]": isSelected(page.id),
                "hover:bg-[#EFEFEF]": !isSelected(page.id),
              },
            )}
            onClick={() => setSelectedPageId(page.id)}>
            <div className="w-6 h-6">{isSelected(page.id) ? <CheckIcon /> : null}</div>
            <span className="line-clamp-1">{page.title}</span>
          </li>
        ))}
      </ul>

      <div className="flex self-stretch border-t-[1.5px] border-black">
        <button className="w-full h-12 bg-white text-[#171717]" onClick={onRequestClose}>
          취소
        </button>
        <button className="w-full h-12 bg-[#242424] text-white" onClick={onUpdateDestinationPageId}>
          연결하기
        </button>
      </div>
    </ReactModal>
  );
}
