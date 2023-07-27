import {useFlowChartStore} from "@/stores";
import {Choice} from "@/types/book";
import {ChangeEvent, useEffect, useState} from "react";

export default function useChoiceContentInput(bookId: number, pageId: number, choice: Choice) {
  const {isSaving, updateChoiceContent} = useFlowChartStore();
  const [content, setContent] = useState<string>(choice.content);

  const onInputContent = (event: ChangeEvent<HTMLInputElement>) => setContent(event.target.value);

  useEffect(() => {
    function updateContent() {
      updateChoiceContent({bookId, pageId, choiceId: choice.id, content});
    }

    if (isSaving) return;
    const timeout = setTimeout(updateContent, 1500);
    return () => clearTimeout(timeout);
  }, [content]);

  return {content, setContent, onInputContent};
}
