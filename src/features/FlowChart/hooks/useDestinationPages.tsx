import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useIdProviderStore from "@/features/FlowChartEditor/stores/useIdProviderStore";
import {useMemo} from "react";

export default function useDestinationPages(pageId: number, choiceId: number) {
  const lanes = useFlowChartEditorStore(state => state.modelLanes);
  const getRealId = useIdProviderStore(state => state.getRealId);
  const allPages = useMemo(() => {
    const pages = lanes.flatMap(lane =>
      lane.pages.map(page => ({
        ...page,
        id: getRealId(page.id),
        laneId: getRealId(page.laneId),
        choices: page.choices.map(choice => ({
          ...choice,
          id: getRealId(choice.id),
          sourcePageId: getRealId(choice.sourcePageId),
          destinationPageId: choice.destinationPageId
            ? getRealId(choice.destinationPageId)
            : choice.destinationPageId,
        })),
        laneOrder: lane.order,
      })),
    );
    return pages;
  }, [lanes]);
  const sourcePage = useMemo(() => allPages.find(page => page.id === pageId), [allPages, pageId]);
  const allPossibleDestinationPages = useMemo(() => {
    if (!sourcePage) return [];
    return allPages
      .filter(page => page.laneOrder > sourcePage.laneOrder)
      .sort((a, b) => a.laneOrder - b.laneOrder)
      .map(page => ({id: page.id, title: page.title}));
  }, [allPages, choiceId]);

  return {allPossibleDestinationPages};
}
