import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import useIdProviderStore from "@/features/FlowChartEditor/stores/useIdProviderStore";
import {useMemo} from "react";

export default function useDestinationPages() {
  const lanes = useFlowChartEditorStore(state => state.modelLanes);
  const getRealId = useIdProviderStore(state => state.getRealId);
  const allPages = useMemo(() => {
    const pages = lanes
      .flatMap(lane =>
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
      )
      .map(page => ({id: page.id, title: page.title}));
    return pages;
  }, [lanes]);

  return {allPages};
}
