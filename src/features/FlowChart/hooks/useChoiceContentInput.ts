import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useDebounce from "@/hooks/useDebounce";
import {useFlowChartStore} from "@/stores";
import {Choice} from "@/types/book";
import {ChangeEvent, useEffect, useState} from "react";

export default function useChoiceContentInput(bookId: number, pageId: number, choice: Choice) {
  // const {isSaving, updateChoiceContent, updateBufferedAction} = useFlowChartStore();
  const loadChoiceContent = useFlowChartEditorStore(state => state.loadChoiceContent);
  const updateChoiceContent = useFlowChartEditorStore(state => state.updateChoiceContent);
  const [content, setContent] = useState<string>(choice.content);

  const onInputContent = (event: ChangeEvent<HTMLInputElement>) => setContent(event.target.value);

  const actionKey = `choice${choice.id}content`;

  useEffect(() => {
    setContent(choice.content);
  }, [choice.content]);
  useEffect(() => {
    updateChoiceContent(choice.id, content);
  }, [content]);

  // useDebounce(
  //   currentContent => {
  //     // updateBufferedAction(actionKey, null);
  //     // updateChoiceContent({bookId, pageId, choiceId: choice.id, content: currentContent});
  //     loadChoiceContent(choice.id, currentContent);
  //   },
  //   1500,
  //   content,
  //   currentContent => {
  //     // updateBufferedAction(actionKey, async () => {
  //     // updateChoiceContent({bookId, pageId, choiceId: choice.id, content: currentContent});
  //     loadChoiceContent(choice.id, currentContent);
  //     // });
  //   },
  //   false,
  // );

  return {content, setContent, onInputContent};
}
