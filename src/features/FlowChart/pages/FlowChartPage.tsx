import {api} from "@/api";
import {DesktopAppBar, SizedBox, SpinningLoader} from "@/components";
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
      <div className="desktop-view">
        <DesktopAppBar />
        <div className="desktop-view-content p-6 relative">
          <div className="flex flex-row justify-between items-center">
            <span className="text-[28px] font-bold">플로우차트</span>
          </div>
          <div className="mt-4 self-stretch border-t-2 border-[#2D3648]" />
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
      </div>
    );

  return (
    <div className="desktop-view">
      <DesktopAppBar />
      <div className="desktop-view-content p-6 relative">
        <div className="flex flex-row justify-between items-center">
          <span className="text-[28px] font-bold">『{flowChart.title}』 플로우차트</span>
        </div>
        <div className="mt-4 self-stretch border-t-2 border-[#2D3648]" />
        <SizedBox height={24} />
      </div>
    </div>
  );
}
