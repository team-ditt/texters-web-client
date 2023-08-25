import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {Page} from "@/types/book";
import {useMemo} from "react";

export default function useConnectedPages() {
  const pages = useFlowChartEditorStore(state => state.viewStates.pages);

  const connectedPages = useMemo(() => {
    const visited = new Set<number>();
    const traverse = (page: Page) => {
      if (visited.has(page.id)) return;
      visited.add(page.id);
      for (let choice of page.choices) {
        if (choice.destinationPageId !== null) {
          traverse(pages[choice.destinationPageId].data);
        }
      }
    };
    for (let page of Object.values(pages)) {
      if (page.data.isIntro) traverse(page.data);
    }
    return visited;
  }, [pages]);

  return {connectedPages};
}
