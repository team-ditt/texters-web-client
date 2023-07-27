import {FlowChartAppBar, SpinningLoader} from "@/components";
import {useAuthGuard} from "@/hooks";
import {useFlowChartStore} from "@/stores";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect} from "react";
import {Link, useParams} from "react-router-dom";

export default function FlowChartPage() {
  const {bookId} = useParams();
  const {flowChart, loadFlowChart} = useFlowChartStore();

  useAuthGuard();

  useEffect(() => {
    if (!flowChart) loadFlowChart(+bookId!);
  }, [flowChart]);

  if (!flowChart)
    return (
      // FIXME: 플로우차트 배경에 맞춰 bg-[#EFEFEF] 수정
      <div className="flow-chart-view bg-[#EFEFEF]">
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
      <FlowChartAppBar />
      <div className="flow-chart-view-content px-6 py-0 relative flex justify-center items-center">
        {/* TODO: 여기에 플로우차트 컴포넌트 넣기 */}
        <Link
          className="px-4 py-1.5 border-2 border-black rounded-full font-medium text-black"
          to={`/studio/books/${bookId}/flow-chart/pages/${flowChart.lanes[0].pages[0].id}`}>
          페이지 수정화면으로 이동
        </Link>
      </div>
    </div>
  );
}
