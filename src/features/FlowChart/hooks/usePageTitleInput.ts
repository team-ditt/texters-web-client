import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useDebounce from "@/hooks/useDebounce";
import {useFlowChartStore} from "@/stores";
import {ChangeEvent, useState} from "react";

export default function usePageTitleInput(bookId: number, pageId: number) {
  const {isSaving, updatePageInfo, updateBufferedAction} = useFlowChartStore();
  const loadPageTitle = useFlowChartEditorStore(state => state.loadPageTitle);
  const [title, setTitle] = useState("");

  const onInputTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);

  const actionKey = `page${pageId}title`;
  useDebounce(
    currentTitle => {
      updateBufferedAction(actionKey, null);
      updatePageInfo({bookId, pageId, title: currentTitle});
      loadPageTitle(pageId, currentTitle);
    },
    1500,
    title,
    currentTitle =>
      updateBufferedAction(actionKey, async () => {
        updatePageInfo({bookId, pageId, title: currentTitle});
        loadPageTitle(pageId, currentTitle);
      }),
    !title || isSaving,
  );

  return {title, setTitle, onInputTitle};
}
