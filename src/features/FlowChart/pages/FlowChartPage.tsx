import {api} from "@/api";
import {FlowChartAppBar, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {useAuthGuard} from "@/hooks";
import {useQuery} from "@tanstack/react-query";
import {AnimatePresence, motion} from "framer-motion";
import {useParams} from "react-router-dom";

export default function FlowChartPage() {
  const {bookId} = useParams();

  const {data: flowChart, isLoading} = useQuery(
    [keys.GET_FLOW_CHART, bookId],
    () => api.books.fetchFlowChart(+bookId!),
    {refetchOnWindowFocus: false},
  );

  useAuthGuard();

  if (!flowChart)
    return (
      <div className="flow-chart-view">
        <AnimatePresence mode="wait">
          <motion.div
            className="absolute inset-0 m-auto w-full h-full bg-white flex justify-center items-center"
            initial={{opacity: 0}}
            animate={{opacity: 0.5}}
            exit={{opacity: 0}}>
            <SpinningLoader color="#BDBDBD" />
          </motion.div>
        </AnimatePresence>
      </div>
    );

  return (
    // FIXME: 플로우차트 배경에 맞춰 bg-[#EFEFEF] 수정
    <div className="flow-chart-view bg-[#EFEFEF]">
      <FlowChartAppBar title={flowChart.title} />
      <div className="flow-chart-view-content px-6 py-0 relative">
        {/* TODO: 여기에 플로우차트 컴포넌트 넣기 */}
      </div>
    </div>
  );
}
