import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useDebounce from "@/hooks/useDebounce";
import {useFlowChartStore} from "@/stores";
import {ChangeEvent, useState} from "react";

export default function usePageContentTextArea(bookId: number, pageId: number) {
  const {isSaving, updatePageInfo} = useFlowChartStore();
  const loadPageContent = useFlowChartEditorStore(state => state.loadPageContent);
  const [content, setContent] = useState<string | null>(null);

  const onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(event.target.value);

  useDebounce(
    currentContent => {
      updatePageInfo({bookId, pageId, content: currentContent});
      loadPageContent(pageId, currentContent ?? "");
    },
    1500,
    content,
    isSaving,
  );

  return {content, setContent, onInputContent};
}
