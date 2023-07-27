import {useFlowChartStore} from "@/stores";
import {ChangeEvent, useEffect, useState} from "react";

export default function usePageTitleInput(bookId: number, pageId: number) {
  const {updatePageInfo} = useFlowChartStore();
  const [title, setTitle] = useState("");

  const onInputTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);

  useEffect(() => {
    function updateTitle() {
      updatePageInfo({bookId, pageId, title});
    }

    if (!title) return;
    const timeout = setTimeout(updateTitle, 1500);
    return () => clearTimeout(timeout);
  }, [title]);

  return {title, setTitle, onInputTitle};
}
