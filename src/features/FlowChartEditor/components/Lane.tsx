import StaticElementLocator from "@/features/FlowChartEditor/components/StaticElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {Lane} from "@/types/book";
import {ViewState} from "@/types/flowChartEditor";
import {ReactComponent as CloseIcon} from "assets/icons/close.svg";
import {useState} from "react";

type Props = {
  viewState: ViewState<Lane>;
};

export default function Lane({viewState}: Props) {
  const lane = viewState.data;
  const elementState = viewState.elementState;
  const newLaneButton = useFlowChartEditorStore(state => state.viewStates.newLaneButton);
  const deleteLane = useFlowChartEditorStore(state => state.deleteLane);
  const [isHovering, setIsHovering] = useState(false);

  if (!elementState) return null;

  const isIntro = lane.order === 0;
  const isEmpty = lane.pages.length === 0;
  const isShowingNewLaneButtonOnRight =
    newLaneButton.toPresent && newLaneButton.data.laneOrder === lane.order;

  const handleDeleteButtonClicked = () => {
    deleteLane(lane.id);
  };

  return (
    <div onMouseOver={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <StaticElementLocator zIndex={0}>
        <div
          style={{
            position: "absolute",
            transform: `translate(${elementState.box.x}px, ${0}px) scale(${elementState.scale})`,
            opacity: elementState.opacity,
            width: elementState.box.width,
            height: elementState.box.height,
            transition: "all 0.05 ease, background-image 0.3s ease",
          }}>
          <div className={`absolute w-[2px] h-[calc(100%-40px)] top-[20px] -right-[1px]`}>
            <div className={`absolute w-full h-full bg-[#DFDFDF]`}></div>
            <div
              className={`absolute w-full h-full transition-all`}
              style={{
                opacity: isShowingNewLaneButtonOnRight ? 1 : 0,
                background: `linear-gradient(180deg, #E3E3E3 0%, #000000 50%, #E3E3E3 100%)`,
              }}></div>
          </div>
          {!isIntro && isHovering && isEmpty && (
            <button
              className="absolute right-[14px] top-[32px] scale-[1.2]"
              onClick={handleDeleteButtonClicked}>
              <CloseIcon width={14} height={14} stroke="#DFDFDF" fill="#DFDFDF" />
            </button>
          )}
        </div>
      </StaticElementLocator>
    </div>
  );
}
