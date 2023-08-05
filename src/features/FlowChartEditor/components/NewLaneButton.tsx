import StaticElementLocator from "@/features/FlowChartEditor/components/StaticElementLocator";
import useFlowChartEditorStore from "@/features/FlowChartEditor/stores/useFlowChartEditorStore";
import {ReactComponent as PlusCircleIcon} from "assets/icons/plus-circle.svg";

export default function NewLaneButton() {
  const viewState = useFlowChartEditorStore(state => state.viewStates.newLaneButton);
  const insertNewLane = useFlowChartEditorStore(state => state.insertNewLane);
  const elementState = viewState.elementState;
  const order = viewState.data.laneOrder;

  if (!elementState) return null;

  const handleClick = () => {
    insertNewLane(order + 1);
  };

  return (
    <StaticElementLocator zIndex={10}>
      <div
        className="absolute"
        style={{
          transform: `translate(${elementState.box.x}px, ${elementState.box.y}px) scale(${elementState.scale})`,
          opacity: elementState.opacity,
          width: elementState.box.width,
          height: elementState.box.height,
        }}>
        <button
          className="absolute w-[22px] h-[22px] m-[1px] rounded-full bg-white shadow-[0_2px_5px_0_#00000080]"
          onClick={handleClick}>
          <PlusCircleIcon
            className="absolute left-[-1px] top-[-1px]"
            width={24}
            height={24}
            stroke="black"
            fill="black"
          />
        </button>
      </div>
    </StaticElementLocator>
  );
}
