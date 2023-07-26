import AutoSaveMarker from "@/components/AutoSaveMarker";
import {ReactComponent as LeftArrowIcon} from "assets/icons/left-arrow.svg";
import {AnimatePresence, motion} from "framer-motion";
import {useNavigate} from "react-router-dom";

type Props = {
  title: string;
};

export default function FlowChartAppBar({title}: Props) {
  const navigate = useNavigate();

  const onGoBack = () => navigate(-1);

  return (
    <AnimatePresence>
      <motion.nav
        className="fixed inset-0 mx-auto my-0 h-14 ps-6 pe-4 bg-white flex justify-between items-center z-[1000]"
        initial={{y: "-100%"}}
        animate={{y: 0}}
        exit={{y: "-100%"}}
        transition={{ease: "easeInOut"}}>
        <div className="flex items-center gap-2">
          <button onClick={onGoBack}>
            <LeftArrowIcon fill="#939393" />
          </button>
          <h1 className="font-bold">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <AutoSaveMarker isSaving={false} />
          {/* TODO: 미리 플레이 버튼 활성화 */}
          <button className="border-2 border-[#242424] rounded-full px-4 py-1.5 font-bold">
            미리 플레이 해보기
          </button>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
