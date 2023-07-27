import {useFlowChartStore} from "@/stores";
import {ChangeEvent, useEffect, useState} from "react";

export default function usePageContentTextArea(bookId: number, pageId: number) {
  const {updatePageInfo} = useFlowChartStore();
  const [content, setContent] = useState<string | null>(null);

  const onInputContent = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(event.target.value);

  function updateContent() {
    updatePageInfo({bookId, pageId, content});
  }

  useEffect(() => {
    const timeout = setTimeout(updateContent, 1500);
    return () => clearTimeout(timeout);
  }, [content]);

  return {content, setContent, onInputContent};
}
