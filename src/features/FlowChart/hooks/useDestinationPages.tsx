import {useFlowChartStore} from "@/stores";
import {useMemo} from "react";

export default function useDestinationPages(pageId: number, choiceId: number) {
  const {flowChart} = useFlowChartStore();
  const allPages = useMemo(() => {
    if (!flowChart) return [];
    const pages = flowChart.lanes.flatMap(lane =>
      lane.pages.map(page => ({...page, laneOrder: lane.order})),
    );
    return pages;
  }, [flowChart]);
  const sourcePage = useMemo(() => allPages.find(page => page.id === pageId), [allPages, pageId]);
  const allPossibleDestinationPages = useMemo(() => {
    if (!sourcePage) return [];
    return allPages
      .filter(page => page.laneOrder > sourcePage.laneOrder)
      .sort((a, b) => a.laneOrder - b.laneOrder);
  }, [allPages, choiceId]);

  return {allPossibleDestinationPages};
}
