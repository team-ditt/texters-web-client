import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useDebounce from "@/hooks/useDebounce";
import {useFlowChartStore} from "@/stores";
import {Page} from "@/types/book";
import {ChangeEvent, useEffect, useState} from "react";

export default function usePageContentTextArea(bookId: number, pageId: number) {
  // const {isSaving, updatePageInfo, updateBufferedAction} = useFlowChartStore();
  const updatePageInfo = useFlowChartEditorStore(state => state.updatePageInfo);
  const loadPageContent = useFlowChartEditorStore(state => state.loadPageContent);
  const [content, setContent] = useState<string | null>(null);

  const onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(event.target.value);

  const actionKey = `page${pageId}content`;
  // useDebounce(
  //   currentContent => {
  //     // updateBufferedAction(actionKey, null);
  //     // updatePageInfo({bookId, pageId, content: currentContent});
  //     loadPageContent(pageId, currentContent ?? "");
  //   },
  //   1500,
  //   content,
  //   currentContent => () =>
  //     // updateBufferedAction(actionKey, async () => {
  //     // updatePageInfo({bookId, pageId, content: currentContent});
  //     loadPageContent(pageId, currentContent ?? ""),
  //   // }),
  //   false,
  // );
  useEffect(() => {
    if (content !== null) loadPageContent(pageId, content);
  }, [content]);
  // useEffect(() => {
  // setContent(page?.content);
  // }, [page?.content]);

  return {content, setContent, onInputContent};
}
