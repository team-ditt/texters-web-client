import {api} from "@/api";
import {FlowChartAppBar, SpinningLoader} from "@/components";
import {keys} from "@/constants";
import {useAuthGuard} from "@/hooks";
import {useQuery} from "@tanstack/react-query";
import {AnimatePresence, motion} from "framer-motion";
import {useParams} from "react-router-dom";

export default function PageEditPage() {
  const {bookId, pageId} = useParams();

  const {
    data: page,
    isLoading,
    isError,
  } = useQuery([keys.GET_FLOW_CHART_PAGE, pageId], () => api.pages.fetchPage(+bookId!, +pageId!));

  useAuthGuard();

  if (!page)
    return (
      // FIXME: 플로우차트 배경에 맞춰 bg-[#EFEFEF] 수정
      <div className="flow-chart-view bg-[#EFEFEF]">
        <FlowChartAppBar />
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
      <div className="flow-chart-view-content px-6 py-0 relative flex justify-center items-center"></div>
    </div>
  );
}
