import {SpinningLoader} from "@/components";
import {FlowChartAppBar} from "@/features/FlowChart/components";
import FlowChartEditor from "@/features/FlowChartEditor/components/FlowChartEditor";
import {useAuthGuard, useMobileViewGuard} from "@/hooks";
import {useFlowChartStore} from "@/stores";
import {AnimatePresence, motion} from "framer-motion";

export default function FlowChartPage() {
  const {flowChart} = useFlowChartStore();

  // const {RequestSignInDialog} = useAuthGuard();
  // const {MobileViewAlert} = useMobileViewGuard();

  if (!flowChart)
    return (
      <div className="flow-chart-view bg-white">
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

        {/* <MobileViewAlert /> */}
        {/* <RequestSignInDialog /> */}
      </div>
    );

  return (
    <div className="flow-chart-view bg-white">
      <FlowChartAppBar />
      <div className="flow-chart-view-content px-6 py-0 relative flex justify-center items-center">
        <FlowChartEditor />
      </div>

      {/* <MobileViewAlert /> */}
      {/* <RequestSignInDialog /> */}
    </div>
  );
}
