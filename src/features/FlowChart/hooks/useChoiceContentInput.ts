import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useDebounce from "@/hooks/useDebounce";
import {useFlowChartStore} from "@/stores";
import {Choice} from "@/types/book";
import {ChangeEvent, useState} from "react";

export default function useChoiceContentInput(bookId: number, pageId: number, choice: Choice) {
  const {isSaving, updateChoiceContent} = useFlowChartStore();
  const loadChoiceContent = useFlowChartEditorStore(state => state.loadChoiceContent);
  const [content, setContent] = useState<string>(choice.content);

  const onInputContent = (event: ChangeEvent<HTMLInputElement>) => setContent(event.target.value);

  useDebounce(
    currentContent => {
      updateChoiceContent({bookId, pageId, choiceId: choice.id, content: currentContent});
      loadChoiceContent(choice.id, currentContent);
    },
    1500,
    content,
    isSaving,
  );

  return {content, setContent, onInputContent};
}
